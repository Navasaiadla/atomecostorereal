import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search') || searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServerSupabaseClient()

    let query = supabase
      .from('products')
      .select(`
        id,
        seller_id,
        title,
        description,
        price,
        stock,
        category_id,
        is_active,
        created_at,
        product_images (
          id,
          image_path,
          is_main
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    // Apply category filter if provided and not 'all'
    if (category && category !== 'all') {
      console.log('🔍 Filtering by category ID:', category)
      query = query.eq('category_id', category)
    }

    // Apply text search across title and description
    if (search && search.trim().length > 0) {
      const like = `%${search.trim()}%`
      // PostgREST OR filter: title ILIKE or description ILIKE
      query = query.or(`title.ilike.${like},description.ilike.${like}`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    const transformedProducts = (products as any[])?.map(product => {
      const rawImages: { id: string; image_path: string; is_main: boolean }[] = Array.isArray(product.product_images) ? product.product_images : []
      const sorted = [...rawImages].sort((a, b) => Number(b.is_main) - Number(a.is_main))
      // Convert storage paths to public URLs
      let productImages = sorted
        .map(img => img.image_path)
        .filter(Boolean)
        .map((p) => supabase.storage.from('product-images').getPublicUrl(p).data.publicUrl)

      if (productImages.length === 0) {
        // Fallback single placeholder if no images exist
        productImages = ['/bamboo-utensils.svg']
      }

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        is_active: product.is_active,
        created_at: product.created_at,
        images: productImages,
        product_images: rawImages,
        seller_id: product.seller_id
      }
    }) || []

    console.log(`✅ Fetched ${transformedProducts.length} products from database`)
    if (category && category !== 'all') {
      console.log(`📂 Category filter applied: ${category}`)
    }
    if (search) {
      console.log(`🔎 Search filter applied: ${search}`)
    }

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Parse multipart form data
    const formData = await request.formData()

    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')
    const price = Number(formData.get('price') || 0)
    const stock = Number(formData.get('stock') || 0)
    const category_id = String(formData.get('category_id') || '')
    const is_active = String(formData.get('status') || 'active') === 'active'

    // Require auth to attribute seller_id
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!title || !category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create product row first
    const { data: inserted, error: insertError } = await supabase
      .from('products')
      .insert({ title, description, price, stock, category_id, is_active, seller_id: user.id })
      .select('id')
      .single()

    if (insertError || !inserted) {
      return NextResponse.json({ error: 'Failed to create product', details: insertError?.message }, { status: 500 })
    }

    const productId = inserted.id as string

    // Handle image files (multiple)
    const imageFiles = formData.getAll('images') as File[]
    const uploadedPaths: string[] = []
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (!(file instanceof File)) continue
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const ext = file.type.split('/')[1] || 'jpg'
      const path = `${productId}/${Date.now()}_${i}.${ext}`
      const { data: storageRes, error: storageErr } = await supabase.storage
        .from('product-images')
        .upload(path, buffer, { contentType: file.type, upsert: false })
      if (storageErr) {
        // continue without failing whole request
        // eslint-disable-next-line no-console
        console.error('Storage upload error:', storageErr)
        continue
      }
      uploadedPaths.push(storageRes?.path || path)
    }

    // Insert product_images rows
    const rows: { product_id: string; image_path: string; is_main: boolean }[] = []
    if (uploadedPaths.length > 0) {
      uploadedPaths.forEach((p, idx) => rows.push({ product_id: productId, image_path: p, is_main: idx === 0 }))
    }
    // Also include any provided direct URLs
    const imageUrlsJson = formData.get('image_urls') as string | null
    if (imageUrlsJson) {
      try {
        const urlList: string[] = JSON.parse(imageUrlsJson)
        urlList.forEach((u) => rows.push({ product_id: productId, image_path: u, is_main: rows.length === 0 }))
      } catch {}
    }
    if (rows.length > 0) {
      await supabase.from('product_images').insert(rows)
    }

    return NextResponse.json({ id: productId, uploaded: uploadedPaths.length })
  } catch (error) {
    console.error('Create product API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}