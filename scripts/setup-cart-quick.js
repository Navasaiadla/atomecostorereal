const { createClient } = require('@supabase/supabase-js')

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please make sure your .env.local file has:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupCart() {
  console.log('🔧 Setting up cart table...')
  
  try {
    // Check if cart table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'cart')
    
    if (tableError) {
      console.error('❌ Error checking tables:', tableError)
      return
    }
    
    if (tables.length === 0) {
      console.log('📝 Cart table does not exist, creating it...')
      
      // Create cart table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS cart (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
          CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart(product_id);
          CREATE INDEX IF NOT EXISTS idx_cart_user_product ON cart(user_id, product_id);
          
          -- Enable RLS
          ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          DROP POLICY IF EXISTS "Users can view their own cart items" ON cart;
          CREATE POLICY "Users can view their own cart items" ON cart
            FOR SELECT USING (auth.uid() = user_id);
          
          DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart;
          CREATE POLICY "Users can insert their own cart items" ON cart
            FOR INSERT WITH CHECK (auth.uid() = user_id);
          
          DROP POLICY IF EXISTS "Users can update their own cart items" ON cart;
          CREATE POLICY "Users can update their own cart items" ON cart
            FOR UPDATE USING (auth.uid() = user_id);
          
          DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart;
          CREATE POLICY "Users can delete their own cart items" ON cart
            FOR DELETE USING (auth.uid() = user_id);
          
          -- Add constraints
          ALTER TABLE cart ADD CONSTRAINT IF NOT EXISTS cart_quantity_positive CHECK (quantity > 0);
          ALTER TABLE cart ADD CONSTRAINT IF NOT EXISTS cart_unique_user_product UNIQUE (user_id, product_id);
        `
      })
      
      if (createError) {
        console.error('❌ Error creating cart table:', createError)
        console.log('💡 You may need to run this SQL manually in your Supabase dashboard:')
        console.log(`
          CREATE TABLE IF NOT EXISTS cart (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Enable RLS
          ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          CREATE POLICY "Users can view their own cart items" ON cart
            FOR SELECT USING (auth.uid() = user_id);
          
          CREATE POLICY "Users can insert their own cart items" ON cart
            FOR INSERT WITH CHECK (auth.uid() = user_id);
          
          CREATE POLICY "Users can update their own cart items" ON cart
            FOR UPDATE USING (auth.uid() = user_id);
          
          CREATE POLICY "Users can delete their own cart items" ON cart
            FOR DELETE USING (auth.uid() = user_id);
        `)
        return
      }
      
      console.log('✅ Cart table created successfully!')
    } else {
      console.log('✅ Cart table already exists')
    }
    
    // Test cart functionality
    console.log('🧪 Testing cart functionality...')
    
    // Get a test product
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, title')
      .eq('is_active', true)
      .limit(1)
    
    if (productError || !products || products.length === 0) {
      console.log('⚠️ No active products found for testing')
      return
    }
    
    const testProduct = products[0]
    console.log(`📦 Found test product: ${testProduct.title} (ID: ${testProduct.id})`)
    
    console.log('✅ Cart setup complete!')
    console.log('💡 Now try adding items to your cart from the website')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

setupCart()





































