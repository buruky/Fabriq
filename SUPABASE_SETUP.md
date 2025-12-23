# Supabase Database Setup

This document contains the SQL commands needed to set up the Fabriq database in Supabase.

## Prerequisites

1. You have a Supabase account at [supabase.com](https://supabase.com)
2. You have created a project
3. You have the project URL and keys in your `.env` file

## Step 1: Create the `clothing_items` Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create the clothing_items table
CREATE TABLE IF NOT EXISTS public.clothing_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_clothing_items_user_id ON public.clothing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_clothing_items_category ON public.clothing_items(category);
```

## Step 2: Enable Row Level Security (RLS)

This ensures users can only see their own wardrobe items:

```sql
-- Enable Row Level Security
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;
```

## Step 3: Create Security Policies

Run each of these policies:

### Policy 1: Users can view their own items

```sql
CREATE POLICY "Users can view own clothing items"
  ON public.clothing_items
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Policy 2: Users can insert their own items

```sql
CREATE POLICY "Users can insert own clothing items"
  ON public.clothing_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Policy 3: Users can update their own items

```sql
CREATE POLICY "Users can update own clothing items"
  ON public.clothing_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Policy 4: Users can delete their own items

```sql
CREATE POLICY "Users can delete own clothing items"
  ON public.clothing_items
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 4: Verify Setup

Run this query to check if everything is set up correctly:

```sql
-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clothing_items';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'clothing_items';
```

## Step 5: Test with Sample Data (Optional)

After logging into your app, you can verify the setup by checking if data is being saved:

```sql
-- View all clothing items (will only show items for authenticated user)
SELECT * FROM public.clothing_items;
```

## Troubleshooting

### Issue: "Permission denied for table clothing_items"

**Solution:** Make sure Row Level Security policies are set up correctly. Run the policies in Step 3.

### Issue: "relation public.clothing_items does not exist"

**Solution:** Run the CREATE TABLE command in Step 1.

### Issue: Users can see other users' items

**Solution:** Check that RLS is enabled (Step 2) and policies are correct (Step 3).

### Issue: Cannot insert items

**Solution:** Make sure the INSERT policy includes `WITH CHECK (auth.uid() = user_id)`.

## Database Schema

```
clothing_items
├── id              UUID (Primary Key, Auto-generated)
├── user_id         UUID (Foreign Key → auth.users.id)
├── name            TEXT (Item name, e.g., "Black tee")
├── category        TEXT (Category, e.g., "Shirts")
├── image_url       TEXT (Cloudinary URL)
└── created_at      TIMESTAMPTZ (Auto-generated timestamp)
```

## Security Features

- ✅ **Row Level Security (RLS)**: Enabled to ensure data isolation
- ✅ **User-specific data**: Users can only access their own items
- ✅ **Cascade delete**: Items are deleted when user account is deleted
- ✅ **Policies**: Separate policies for SELECT, INSERT, UPDATE, DELETE

## Next Steps

After setting up the database:

1. ✅ Make sure your `.env` file has the correct Supabase credentials
2. ✅ Test by creating a new account and adding a clothing item
3. ✅ Verify that items are saved by refreshing the page
4. ✅ Log in from a different browser and verify items sync

## Notes

- The `outfits` table follows a similar pattern if you need to set it up
- All timestamps are in UTC
- UUIDs are automatically generated
- The database is already configured in `/src/services/supabase.js`
