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

async function setupReviews() {
  console.log('🚀 Setting up reviews table...\n')

  try {
    // Check if reviews table exists
    console.log('1. Checking if reviews table exists...')
    const { data: tables, error: tablesError } = await supabase
      .from('reviews')
      .select('id')
      .limit(1)

    if (tablesError && tablesError.code === 'PGRST116') {
      console.log('📝 Reviews table does not exist, creating it...')
      
      // Create reviews table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS reviews (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            title TEXT,
            comment TEXT,
            is_verified_purchase BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(product_id, customer_id)
          );
          
          -- Create indexes for better performance
          CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
          CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
          CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
          CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
          
          -- Create trigger to update updated_at timestamp
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
          END;
          $$ language 'plpgsql';
          
          CREATE TRIGGER update_reviews_updated_at 
              BEFORE UPDATE ON reviews 
              FOR EACH ROW 
              EXECUTE FUNCTION update_updated_at_column();
          
          -- Enable Row Level Security (RLS)
          ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
          
          -- Create policies for reviews
          -- Users can view all reviews for products
          CREATE POLICY "Anyone can view reviews" ON reviews
            FOR SELECT USING (true);
          
          -- Users can insert their own reviews
          CREATE POLICY "Users can insert their own reviews" ON reviews
            FOR INSERT WITH CHECK (auth.uid() = customer_id);
          
          -- Users can update their own reviews
          CREATE POLICY "Users can update their own reviews" ON reviews
            FOR UPDATE USING (auth.uid() = customer_id);
          
          -- Users can delete their own reviews
          CREATE POLICY "Users can delete their own reviews" ON reviews
            FOR DELETE USING (auth.uid() = customer_id);
          
          -- Create a function to calculate average rating for a product
          CREATE OR REPLACE FUNCTION calculate_product_rating(product_uuid UUID)
          RETURNS TABLE(
            average_rating DECIMAL(3,2),
            total_reviews INTEGER
          ) AS $$
          BEGIN
            RETURN QUERY
            SELECT 
              ROUND(AVG(r.rating)::DECIMAL, 2) as average_rating,
              COUNT(r.id)::INTEGER as total_reviews
            FROM reviews r
            WHERE r.product_id = product_uuid;
          END;
          $$ LANGUAGE plpgsql;
        `
      })

      if (createError) {
        console.error('❌ Error creating reviews table:', createError)
        return
      }

      console.log('✅ Reviews table created successfully!')
    } else if (tablesError) {
      console.error('❌ Error checking reviews table:', tablesError)
      return
    } else {
      console.log('✅ Reviews table already exists')
    }

    // Test the reviews table
    console.log('\n2. Testing reviews table...')
    const { data: testReviews, error: testError } = await supabase
      .from('reviews')
      .select('id, product_id, customer_id, rating, title, comment, is_verified_purchase, created_at')
      .limit(5)

    if (testError) {
      console.error('❌ Error testing reviews table:', testError)
    } else {
      console.log(`✅ Reviews table is working! Found ${testReviews?.length || 0} reviews`)
      if (testReviews && testReviews.length > 0) {
        console.log('📊 Sample review:', testReviews[0])
      }
    }

    console.log('\n🎉 Reviews table setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Users can now write reviews on product pages')
    console.log('2. Reviews will be displayed with ratings and comments')
    console.log('3. Verified purchase badges will be shown for users who bought the product')
    console.log('4. Average ratings will be calculated automatically')

  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

setupReviews()







































