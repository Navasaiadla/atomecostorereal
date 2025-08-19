export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Fetch categories from database
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching categories from database:', error)
      // Fallback to default categories if database fails
      const fallbackCategories = [
        { id: 'all', name: 'All', description: 'All products', image: '/products/bamboo-utensils.svg' },
        { id: 'home-living', name: 'Home & Living', description: 'Eco-friendly home products', image: '/products/bamboo-utensils.svg' },
        { id: 'personal-care', name: 'Personal Care', description: 'Natural personal care products', image: '/products/bamboo-utensils.svg' },
        { id: 'kitchen', name: 'Kitchen & Dining', description: 'Sustainable kitchen products', image: '/products/bamboo-utensils.svg' },
        { id: 'clothes', name: 'Clothes', description: 'Organic clothing', image: '/products/bamboo-utensils.svg' }
      ]
      
      return NextResponse.json({
        categories: fallbackCategories
      })
    }

    // Transform categories to match frontend expectations
    const transformedCategories = (categories as Array<{ id: string; Category?: string }>).map((cat: { id: string; Category?: string }) => ({
      id: cat.id,
      name: cat.Category || 'Unnamed Category', // Use the 'Category' field from database
      description: `${cat.Category || 'Eco-friendly'} products`,
      image: '/products/bamboo-utensils.svg'
    }))

    // Add "All" category at the beginning
    const allCategories = [
      { id: 'all', name: 'All', description: 'All products', image: '/products/bamboo-utensils.svg' },
      ...transformedCategories
    ]

    return NextResponse.json({
      categories: allCategories
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
