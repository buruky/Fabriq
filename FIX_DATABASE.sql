-- =====================================================
-- DATABASE FIX: Check and repair Fabriq database
-- =====================================================
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- STEP 1: Check if clothing_items exist
-- =====================================================
SELECT
  'Clothing Items Count' as check_name,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) = 0 THEN '⚠️  WARNING: No clothing items found!'
    ELSE '✅ OK'
  END as status
FROM public.clothing_items;

-- STEP 2: Check outfits table exists
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'outfits') THEN
    RAISE NOTICE '⚠️  Outfits table does NOT exist - creating it now...';

    -- Create the outfits table
    CREATE TABLE public.outfits (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      name TEXT NOT NULL,
      notes TEXT,
      clothing_item_ids UUID[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX idx_outfits_user_id ON public.outfits(user_id);
    CREATE INDEX idx_outfits_created_at ON public.outfits(created_at DESC);

    -- Enable RLS
    ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view own outfits"
      ON public.outfits FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own outfits"
      ON public.outfits FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own outfits"
      ON public.outfits FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own outfits"
      ON public.outfits FOR DELETE
      USING (auth.uid() = user_id);

    RAISE NOTICE '✅ Outfits table created successfully!';
  ELSE
    RAISE NOTICE '✅ Outfits table already exists';
  END IF;
END $$;

-- STEP 3: Verify both tables
-- =====================================================
SELECT
  'Tables Check' as check_name,
  COUNT(*) FILTER (WHERE tablename = 'clothing_items') as has_clothing_items,
  COUNT(*) FILTER (WHERE tablename = 'outfits') as has_outfits,
  CASE
    WHEN COUNT(*) FILTER (WHERE tablename = 'clothing_items') = 1
     AND COUNT(*) FILTER (WHERE tablename = 'outfits') = 1
    THEN '✅ Both tables exist'
    ELSE '⚠️  Missing tables!'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('clothing_items', 'outfits');

-- STEP 4: Check for any foreign key constraints that might be deleting items
-- =====================================================
SELECT
  'Foreign Keys Check' as check_name,
  conname as constraint_name,
  conrelid::regclass as table_name,
  confrelid::regclass as referenced_table,
  confdeltype as on_delete_action,
  CASE confdeltype
    WHEN 'a' THEN 'NO ACTION'
    WHEN 'r' THEN 'RESTRICT'
    WHEN 'c' THEN '⚠️  CASCADE (items will be deleted!)'
    WHEN 'n' THEN 'SET NULL'
    WHEN 'd' THEN 'SET DEFAULT'
  END as delete_behavior
FROM pg_constraint
WHERE contype = 'f'
  AND (conrelid::regclass::text LIKE '%clothing_items%'
       OR confrelid::regclass::text LIKE '%clothing_items%');

-- STEP 5: List all your data
-- =====================================================
SELECT 'Your Data Summary' as summary, * FROM (
  SELECT
    (SELECT COUNT(*) FROM public.clothing_items) as total_clothing_items,
    (SELECT COUNT(*) FROM public.outfits) as total_outfits,
    (SELECT COUNT(DISTINCT user_id) FROM public.clothing_items) as users_with_items
) data;

-- STEP 6: Show recent clothing items (to verify they weren't deleted)
-- =====================================================
SELECT
  'Recent Clothing Items' as info,
  id,
  name,
  category,
  created_at,
  user_id
FROM public.clothing_items
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- INSTRUCTIONS
-- =====================================================
-- After running this script:
-- 1. Check the output for any ⚠️  warnings
-- 2. If clothing items count is 0, your items were deleted!
-- 3. If outfits table didn't exist, it's now created
-- 4. Go back to your app and try creating an outfit again
-- =====================================================
