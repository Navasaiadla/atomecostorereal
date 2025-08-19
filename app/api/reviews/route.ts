import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('reviews')
      .select('id, product_id, user_id, rating, comment, created_at')
      .order('created_at', { ascending: false })

    if (productId) query = query.eq('product_id', productId)
    if (userId) query = query.eq('user_id', userId)

    const { data: reviews, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    const list = reviews || []

    // Fetch reviewer names (no FK join assumed)
    const userIds = Array.from(new Set((list as Array<{ user_id: string | null }>).
      map((r: { user_id: string | null }) => r.user_id).
      filter((v: string | null): v is string => Boolean(v))
    ))
    let idToProfile: Record<string, { full_name: string | null; email: string | null }> = {}
    if (userIds.length > 0) {
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds)
      if (!pErr && profiles) {
        for (const p of profiles as any[]) {
          idToProfile[p.id] = { full_name: p.full_name ?? null, email: p.email ?? null }
        }
      }
    }

    const enriched = (list as Array<{ user_id: string }>).
      map((r: { user_id: string }) => ({
      ...r,
      reviewer_name: idToProfile[r.user_id]?.full_name || idToProfile[r.user_id]?.email || 'Anonymous',
      reviewer_email: idToProfile[r.user_id]?.email || null,
    }))

    return NextResponse.json({ reviews: enriched })
  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, rating, comment } = body

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid product ID or rating' }, { status: 400 })
    }

    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
    }

    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: user.id,
        rating,
        comment: comment ?? null,
      })
      .select('id, product_id, user_id, rating, comment, created_at')
      .single()

    if (insertError || !review) {
      console.error('Error inserting review:', insertError)
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }

    // Enrich with reviewer name
    let reviewer_name: string | null = null
    let reviewer_email: string | null = null
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .maybeSingle()
    if (profile) {
      reviewer_name = profile.full_name || profile.email || null
      reviewer_email = profile.email || null
    }

    return NextResponse.json({ review: { ...review, reviewer_name: reviewer_name || 'Anonymous', reviewer_email } })
  } catch (error) {
    console.error('Create review API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

