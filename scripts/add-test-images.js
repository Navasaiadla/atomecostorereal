const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please check your .env.local file has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addTestImages() {
  try {
    console.log('🔍 Fetching existing products...')
    
    // First, get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title')
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError)
      return
    }
    
    console.log(`📦 Found ${products?.length || 0} products`)
    
    if (!products || products.length === 0) {
      console.log('❌ No products found. Please add products first.')
      return
    }
    
    // Sample image URLs (public images that should work)
    const sampleImages = [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    ]
    
    console.log('🖼️ Adding test images to products...')
    
    // Add images for each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const imageUrl = sampleImages[i % sampleImages.length]
      
      console.log(`📸 Adding image for product: ${product.title}`)
      
      const { data: imageData, error: imageError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_url: imageUrl,
          is_primary: true
        })
      
      if (imageError) {
        console.error(`❌ Error adding image for ${product.title}:`, imageError)
      } else {
        console.log(`✅ Added image for ${product.title}`)
      }
    }
    
    console.log('🎉 Test images added successfully!')
    
    // Verify the images were added
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
    
    if (imagesError) {
      console.error('❌ Error fetching images:', imagesError)
    } else {
      console.log(`📊 Total images in database: ${images?.length || 0}`)
    }
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

addTestImages()
