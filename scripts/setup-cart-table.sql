-- Cart Table Setup Script
-- Run this in your Supabase SQL Editor

-- Create the cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_product ON cart(user_id, product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
-- Users can only see their own cart items
CREATE POLICY "Users can view their own cart items" ON cart
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items" ON cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items" ON cart
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items" ON cart
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cart_updated_at
  BEFORE UPDATE ON cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add constraints
ALTER TABLE cart ADD CONSTRAINT cart_quantity_positive CHECK (quantity > 0);
ALTER TABLE cart ADD CONSTRAINT cart_unique_user_product UNIQUE (user_id, product_id);

-- Grant necessary permissions
GRANT ALL ON cart TO authenticated;
GRANT USAGE ON SEQUENCE cart_id_seq TO authenticated;

-- Insert some test data (optional - remove if you don't want test data)
-- INSERT INTO cart (user_id, product_id, quantity) VALUES 
-- ('your-user-id-here', 'your-product-id-here', 1);

COMMENT ON TABLE cart IS 'Shopping cart items for users';
COMMENT ON COLUMN cart.user_id IS 'Reference to the user who owns this cart item';
COMMENT ON COLUMN cart.product_id IS 'Reference to the product in the cart';
COMMENT ON COLUMN cart.quantity IS 'Quantity of the product in the cart';

