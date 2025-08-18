const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabase() {
  console.log('🔍 Checking Database Structure...\n')

  try {
    // Check if cart table exists
    console.log('1. Checking cart table...')
    const { data: cartData, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .limit(1)

    if (cartError) {
      console.log('❌ Cart table error:', cartError.message)
      console.log('💡 You need to create the cart table. Run the SQL from scripts/setup-cart-table.sql in your Supabase dashboard')
    } else {
      console.log('✅ Cart table exists and is accessible')
    }

    // Check if products table exists
    console.log('\n2. Checking products table...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (productsError) {
      console.log('❌ Products table error:', productsError.message)
    } else {
      console.log('✅ Products table exists and is accessible')
      console.log(`   Found ${productsData?.length || 0} products`)
    }

    // Check if profiles table exists
    console.log('\n3. Checking profiles table...')
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message)
    } else {
      console.log('✅ Profiles table exists and is accessible')
    }

    // Check RLS policies
    console.log('\n4. Checking Row Level Security...')
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.policies')
      .select('*')
      .eq('table_name', 'cart')

    if (policiesError) {
      console.log('❌ Could not check RLS policies:', policiesError.message)
    } else {
      console.log(`✅ Found ${policies?.length || 0} RLS policies for cart table`)
    }

    // Check environment variables
    console.log('\n5. Environment Variables:')
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')

    console.log('\n📋 Summary:')
    if (!cartError && !productsError && !profilesError) {
      console.log('✅ Database structure looks good!')
      console.log('💡 If you\'re still having issues, check:')
      console.log('   - Authentication status')
      console.log('   - Browser console for errors')
      console.log('   - Network tab for failed requests')
    } else {
      console.log('❌ Database structure needs attention')
      console.log('💡 Run the setup scripts in your Supabase dashboard')
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message)
  }
}

checkDatabase()

