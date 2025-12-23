-- =====================================================
-- OUTFITS TABLE SETUP FOR SUPABASE
-- =====================================================
-- Run this in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- Step 1: Create the outfits table
CREATE TABLE IF NOT EXISTS public.outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  notes TEXT,
  clothing_item_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON public.outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_created_at ON public.outfits(created_at DESC);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies
-- Policy 1: Users can view their own outfits
CREATE POLICY "Users can view own outfits"
  ON public.outfits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own outfits
CREATE POLICY "Users can insert own outfits"
  ON public.outfits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own outfits
CREATE POLICY "Users can update own outfits"
  ON public.outfits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own outfits
CREATE POLICY "Users can delete own outfits"
  ON public.outfits
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create a trigger to call the function
DROP TRIGGER IF EXISTS update_outfits_updated_at ON public.outfits;
CREATE TRIGGER update_outfits_updated_at
    BEFORE UPDATE ON public.outfits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'outfits'
ORDER BY ordinal_position;

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'outfits';

-- =====================================================
-- NOTES
-- =====================================================
-- - clothing_item_ids is an array of UUIDs that reference clothing_items.id
-- - This is NOT a foreign key constraint, so deleting a clothing item
--   will NOT delete the outfit or remove the ID from the array
-- - You'll need to handle orphaned IDs in your application logic
-- - The array allows multiple items per outfit
-- - Example: clothing_item_ids = '{uuid1, uuid2, uuid3}'
