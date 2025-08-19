require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('Current values:')
  console.error('URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('Key:', supabaseKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample categories data
const sampleCategories = [
  {
    name: 'Home & Living',
    description: 'Eco-friendly products for your home and living spaces',
    image_url: '/products/bamboo-utensils.svg'
  },
  {
    name: 'Personal Care',
    description: 'Natural and organic personal care products',
    image_url: '/products/bamboo-utensils.svg'
  },
  {
    name: 'Kitchen & Dining',
    description: 'Sustainable kitchen and dining products',
    image_url: '/products/bamboo-utensils.svg'
  },
  {
    name: 'Clothing & Fashion',
    description: 'Organic and sustainable clothing and fashion items',
    image_url: '/products/bamboo-utensils.svg'
  },
  {
    name: 'Bathroom & Hygiene',
    description: 'Eco-friendly bathroom and hygiene products',
    image_url: '/products/bamboo-utensils.svg'
  },
  {
    name: 'Office & Stationery',
    description: 'Sustainable office supplies and stationery',
    image_url: '/products/bamboo-utensils.svg'
  },
  {
    name: 'Garden & Outdoor',
    description: 'Eco-friendly garden and outdoor products',
    image_url: '/products/bamboo-utensils.svg'
  },
  {
    name: 'Baby & Kids',
    description: 'Safe and sustainable products for babies and children',
    image_url: '/products/bamboo-utensils.svg'
  }
]

async function createCategoriesTable() {
  try {
    console.log('🔍 Checking if categories table exists...')
    
    // Try to query the categories table
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('❌ Categories table does not exist. Creating it...')
      
      // Create the categories table using SQL
      const { error: createError } = await supabase
        .from('categories')
        .select('*')
        .limit(0) // This will fail if table doesn't exist, but we'll handle it differently
      
      if (createError) {
        console.log('Table does not exist, but we cannot create it via client. Please create it manually in Supabase dashboard.')
        console.log('SQL to create table:')
        console.log(`
          CREATE TABLE IF NOT EXISTS categories (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Enable Row Level Security
          ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
          
          -- Create policy for public read access
          CREATE POLICY "Anyone can view categories" ON categories
            FOR SELECT USING (true);
          
          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
          CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at);
        `)
        return false
      }
      
      console.log('✅ Categories table created successfully!')
    } else if (checkError) {
      console.error('❌ Error checking categories table:', checkError)
      return false
    } else {
      console.log('✅ Categories table already exists!')
    }
    
    return true
  } catch (error) {
    console.error('❌ Error in createCategoriesTable:', error)
    return false
  }
}

async function insertCategories() {
  try {
    console.log('📂 Inserting sample categories...')
    
    // Check if categories already exist
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('*')
    
    if (checkError) {
      console.error('❌ Error checking existing categories:', checkError)
      return false
    }
    
    if (existingCategories && existingCategories.length > 0) {
      console.log(`✅ Categories already exist (${existingCategories.length} found)`)
      console.log('📋 Existing categories:')
      existingCategories.forEach(cat => {
        console.log(`  - ${cat.name}: ${cat.description}`)
      })
      return true
    }
    
    // Insert sample categories
    const { data: newCategories, error: insertError } = await supabase
      .from('categories')
      .insert(sampleCategories)
      .select()
    
    if (insertError) {
      console.error('❌ Error inserting categories:', insertError)
      return false
    }
    
    console.log(`✅ Successfully inserted ${newCategories.length} categories:`)
    newCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.description}`)
    })
    
    return true
  } catch (error) {
    console.error('❌ Error in insertCategories:', error)
    return false
  }
}

async function main() {
  try {
    console.log('🚀 Starting categories setup...')
    console.log('🔗 Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
    console.log('🔑 Supabase Key:', supabaseKey ? 'Set' : 'Missing')
    
    // Create table if it doesn't exist
    const tableCreated = await createCategoriesTable()
    if (!tableCreated) {
      console.error('❌ Failed to create categories table')
      process.exit(1)
    }
    
    // Insert sample categories
    const categoriesInserted = await insertCategories()
    if (!categoriesInserted) {
      console.error('❌ Failed to insert categories')
      process.exit(1)
    }
    
    console.log('🎉 Categories setup completed successfully!')
    
    // Verify the setup
    console.log('\n🔍 Verifying setup...')
    const { data: categories, error: verifyError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (verifyError) {
      console.error('❌ Error verifying categories:', verifyError)
    } else {
      console.log(`✅ Found ${categories.length} categories in database`)
      console.log('📊 Categories summary:')
      categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name} (ID: ${cat.id})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

// Run the script
main()
