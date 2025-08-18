import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: review, error } = await supabase
      .from('reviews')
      .select('id, product_id, user_id, rating, comment, created_at')
      .eq('id', params.id)
      .single()

    if (error || !review) {
      console.error('Error fetching review:', error)
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    let reviewer_name: string | null = null
    let reviewer_email: string | null = null
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', review.user_id)
      .maybeSingle()
    if (profile) {
      reviewer_name = profile.full_name || profile.email || null
      reviewer_email = profile.email || null
    }

    return NextResponse.json({ review: { ...review, reviewer_name: reviewer_name || 'Anonymous', reviewer_email } })
  } catch (error) {
    console.error('Get review API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
    }

    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (existingReview.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: review, error: updateError } = await supabase
      .from('reviews')
      .update({ rating, comment: comment ?? null })
      .eq('id', params.id)
      .select('id, product_id, user_id, rating, comment, created_at')
      .single()

    if (updateError || !review) {
      console.error('Error updating review:', updateError)
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }

    let reviewer_name: string | null = null
    let reviewer_email: string | null = null
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', review.user_id)
      .maybeSingle()
    if (profile) {
      reviewer_name = profile.full_name || profile.email || null
      reviewer_email = profile.email || null
    }

    return NextResponse.json({ review: { ...review, reviewer_name: reviewer_name || 'Anonymous', reviewer_email } })
  } catch (error) {
    console.error('Update review API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (existingReview.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting review:', deleteError)
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Delete review API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

