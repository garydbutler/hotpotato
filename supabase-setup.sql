-- HotPotato Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  detected_item TEXT NOT NULL,
  confidence INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings(user_id);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own listings" ON listings;
DROP POLICY IF EXISTS "Users can create their own listings" ON listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON listings;

-- Create RLS policies
CREATE POLICY "Users can view their own listings"
  ON listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket setup instructions:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket called 'listings'
-- 3. Set it to public or configure the following policy:

-- Storage policy for listings bucket (run after creating the bucket)
-- Note: Replace 'listings' with your actual bucket name if different

-- Allow authenticated users to upload images
-- CREATE POLICY "Authenticated users can upload images"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'listings');

-- Allow users to view all images
-- CREATE POLICY "Public can view images"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'listings');

-- Allow users to delete their own images
-- CREATE POLICY "Users can delete their own images"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
