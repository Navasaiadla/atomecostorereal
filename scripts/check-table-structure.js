const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTableStructure() {
  try {
    console.log('🔍 Checking product_images table structure...')
    
    // Get all records from product_images to see the structure
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .limit(1)
    
    if (imagesError) {
      console.error('❌ Error fetching product_images:', imagesError)
      return
    }
    
    console.log('📊 Product Images Table Structure:')
    if (images && images.length > 0) {
      const firstImage = images[0]
      console.log('Columns found:')
      Object.keys(firstImage).forEach(key => {
        console.log(`  - ${key}: ${typeof firstImage[key]} = ${firstImage[key]}`)
      })
    } else {
      console.log('No records found in product_images table')
    }
    
    // Also check products table structure
    console.log('\n📦 Products Table Structure:')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError)
    } else if (products && products.length > 0) {
      const firstProduct = products[0]
      console.log('Columns found:')
      Object.keys(firstProduct).forEach(key => {
        console.log(`  - ${key}: ${typeof firstProduct[key]} = ${firstProduct[key]}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

checkTableStructure()
