require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCategories() {
  try {
    console.log('🔍 Checking categories table structure and data...')
    
    // Get all categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching categories:', error)
      return
    }
    
    console.log(`📊 Found ${categories.length} categories:`)
    console.log('\n📋 Categories data:')
    categories.forEach((cat, index) => {
      console.log(`\n${index + 1}. Category ID: ${cat.id}`)
      console.log(`   Created: ${cat.created_at}`)
      console.log(`   Raw data:`, JSON.stringify(cat, null, 2))
    })
    
    // Check table structure by looking at the first item
    if (categories.length > 0) {
      console.log('\n🏗️ Table structure (from first record):')
      const firstCat = categories[0]
      Object.keys(firstCat).forEach(key => {
        console.log(`   ${key}: ${typeof firstCat[key]} = ${firstCat[key]}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkCategories()
