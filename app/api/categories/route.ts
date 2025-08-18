import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch categories from database
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching categories from database:', error)
      // Fallback to default categories if database fails
      const fallbackCategories = [
        { id: 'all', name: 'All', description: 'All products', image: '/bamboo-utensils.svg' },
        { id: 'home-living', name: 'Home & Living', description: 'Eco-friendly home products', image: '/bamboo-utensils.svg' },
        { id: 'personal-care', name: 'Personal Care', description: 'Natural personal care products', image: '/bamboo-utensils.svg' },
        { id: 'kitchen', name: 'Kitchen & Dining', description: 'Sustainable kitchen products', image: '/bamboo-utensils.svg' },
        { id: 'clothes', name: 'Clothes', description: 'Organic clothing', image: '/bamboo-utensils.svg' }
      ]
      
      return NextResponse.json({
        categories: fallbackCategories
      })
    }

    // Transform categories to match frontend expectations
    const transformedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.Category || 'Unnamed Category', // Use the 'Category' field from database
      description: `${cat.Category || 'Eco-friendly'} products`,
      image: '/bamboo-utensils.svg'
    }))

    // Add "All" category at the beginning
    const allCategories = [
      { id: 'all', name: 'All', description: 'All products', image: '/bamboo-utensils.svg' },
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
