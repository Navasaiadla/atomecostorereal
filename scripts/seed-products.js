const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const sampleProducts = [
  {
    title: 'Eco-Friendly Shopping Bag',
    description: 'Reusable shopping bag made from sustainable materials',
    price: 199,
    stock: 50,
    category_id: null, // Will be set after categories are created
    seller_id: '00000000-0000-0000-0000-000000000000', // Default seller ID
    is_active: true
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable t-shirt made from 100% organic cotton',
    price: 449,
    stock: 30,
    category_id: null,
    seller_id: '00000000-0000-0000-0000-000000000000',
    is_active: true
  },
  {
    title: 'Bamboo Travel Cup',
    description: 'Sustainable travel cup made from bamboo',
    price: 249,
    stock: 25,
    category_id: null,
    seller_id: '00000000-0000-0000-0000-000000000000',
    is_active: true
  },
  {
    title: 'Natural Book',
    description: 'Book printed on recycled paper with eco-friendly ink',
    price: 299,
    stock: 15,
    category_id: null,
    seller_id: '00000000-0000-0000-0000-000000000000',
    is_active: true
  },
  {
    title: 'Bamboo Toothbrush Set',
    description: 'Set of biodegradable bamboo toothbrushes',
    price: 199,
    stock: 100,
    category_id: null,
    seller_id: '00000000-0000-0000-0000-000000000000',
    is_active: true
  },
  {
    title: 'Organic Handmade Soap',
    description: 'Natural soap made with organic ingredients',
    price: 89,
    stock: 75,
    category_id: null,
    seller_id: '00000000-0000-0000-0000-000000000000',
    is_active: true
  }
]

const sampleCategories = [
  {
    name: 'Home & Living',
    description: 'Eco-friendly products for your home',
    image_url: '/bamboo-utensils.svg'
  },
  {
    name: 'Personal Care',
    description: 'Natural and organic personal care products',
    image_url: '/bamboo-utensils.svg'
  },
  {
    name: 'Kitchen & Dining',
    description: 'Sustainable kitchen and dining products',
    image_url: '/bamboo-utensils.svg'
  },
  {
    name: 'Clothes',
    description: 'Organic and sustainable clothing',
    image_url: '/bamboo-utensils.svg'
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // First, create categories
    console.log('📂 Creating categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert(sampleCategories)
      .select()

    if (categoriesError) {
      console.error('❌ Error creating categories:', categoriesError)
      return
    }

    console.log('✅ Categories created:', categories.length)

    // Get the first category ID to use for products
    const categoryId = categories[0]?.id

    // Update products with category ID
    const productsWithCategory = sampleProducts.map(product => ({
      ...product,
      category_id: categoryId
    }))

    // Create products
    console.log('📦 Creating products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(productsWithCategory)
      .select()

    if (productsError) {
      console.error('❌ Error creating products:', productsError)
      return
    }

    console.log('✅ Products created:', products.length)
    console.log('🎉 Database seeding completed successfully!')

    // Display created data
    console.log('\n📊 Summary:')
    console.log(`- Categories: ${categories.length}`)
    console.log(`- Products: ${products.length}`)
    
    console.log('\n📋 Created Categories:')
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`)
    })

    console.log('\n📋 Created Products:')
    products.forEach(prod => {
      console.log(`  - ${prod.title} (₹${prod.price})`)
    })

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seeding function
seedDatabase()
