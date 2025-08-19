import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await context.params
    const supabase = await createServerSupabaseClient()

    // Fetch the specific product (active first)
    console.log('PRD request for productId:', productId)
    let { data: product, error: productError } = await supabase
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
      .eq('id', productId)
      .eq('is_active', true)
      .single()

    // Fallback: if not found as active, try fetching regardless of is_active
    if ((!product && !productError) || (productError && productError.code === 'PGRST116')) {
      console.log('Active product not found, trying without is_active filter')
      const fallback = await supabase
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
        .eq('id', productId)
        .single()
      product = fallback.data as any
      productError = fallback.error as any
    }

    if (productError) {
      console.error('Error fetching product:', productError)
      return NextResponse.json({ error: 'Failed to fetch product', details: productError.message }, { status: 500 })
    }

    if (!product) {
      console.log('Fetched product is null for id:', productId)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log('Fetched product:', { id: product.id, title: product.title, is_active: product.is_active })

    // Fetch reviews for this product
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
    }

    // Calculate average rating and total reviews
    let averageRating = 4.5 // Default rating
    let totalReviews = 0

    if (reviews && reviews.length > 0) {
      const totalRating = (reviews as Array<{ rating: number }>).reduce(
        (sum: number, review: { rating: number }) => sum + review.rating,
        0
      )
      averageRating = totalRating / reviews.length
      totalReviews = reviews.length
    }

    // Build images with is_main first; fallback to single placeholder
    const rawImages: { image_path: string; is_main: boolean }[] = Array.isArray((product as any).product_images) ? (product as any).product_images : []
    const sorted = [...rawImages].sort((a, b) => Number(b.is_main) - Number(a.is_main))
    const toPublic = (p: string) => p?.startsWith('http') || p?.startsWith('/')
      ? p
      : supabase.storage.from('product-images').getPublicUrl(p).data.publicUrl
    const productImages = sorted.map(img => img.image_path).filter(Boolean).map(toPublic)
    console.log('product_images count:', rawImages.length, 'images after sort/filter:', productImages.length)
    const imagesOut = productImages.length > 0 ? productImages : ['/products/bamboo-utensils.svg']

    // Transform the data to match the frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      originalPrice: null,
      rating: Math.round(averageRating * 10) / 10,
      reviews: totalReviews,
      category: 'Eco-Friendly',
      categoryId: product.category_id,
      image: imagesOut[0],
      images: imagesOut,
      tag: 'Eco-Friendly',
      discount: 0,
      stockQuantity: product.stock
    }

    return NextResponse.json({
      product: transformedProduct
    })
  } catch (error) {
    console.error('Error in product detail API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
