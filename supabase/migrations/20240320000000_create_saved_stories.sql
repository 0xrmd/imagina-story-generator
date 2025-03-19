-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own saved stories" ON public.saved_stories;
DROP POLICY IF EXISTS "Users can insert their own saved stories" ON public.saved_stories;
DROP POLICY IF EXISTS "Users can update their own saved stories" ON public.saved_stories;
DROP POLICY IF EXISTS "Users can delete their own saved stories" ON public.saved_stories;

-- Create saved_stories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.saved_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add child_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'child_name') THEN
        ALTER TABLE public.saved_stories ADD COLUMN child_name TEXT;
    END IF;

    -- Add child_age column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'child_age') THEN
        ALTER TABLE public.saved_stories ADD COLUMN child_age INTEGER;
    END IF;

    -- Add story_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'story_type') THEN
        ALTER TABLE public.saved_stories ADD COLUMN story_type TEXT;
    END IF;

    -- Add interests column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'interests') THEN
        ALTER TABLE public.saved_stories ADD COLUMN interests TEXT;
    END IF;

    -- Add is_autism_friendly column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'is_autism_friendly') THEN
        ALTER TABLE public.saved_stories ADD COLUMN is_autism_friendly BOOLEAN DEFAULT false;
    END IF;

    -- Add moral column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'moral') THEN
        ALTER TABLE public.saved_stories ADD COLUMN moral TEXT;
    END IF;

    -- Add vocabulary column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'vocabulary') THEN
        ALTER TABLE public.saved_stories ADD COLUMN vocabulary TEXT[];
    END IF;

    -- Add reading_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'saved_stories' AND column_name = 'reading_time') THEN
        ALTER TABLE public.saved_stories ADD COLUMN reading_time TEXT;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.saved_stories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own saved stories"
    ON public.saved_stories
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved stories"
    ON public.saved_stories
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved stories"
    ON public.saved_stories
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved stories"
    ON public.saved_stories
    FOR DELETE
    USING (auth.uid() = user_id); 