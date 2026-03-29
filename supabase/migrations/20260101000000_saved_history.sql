-- Create saved_queries table
CREATE TABLE IF NOT EXISTS public.saved_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('translate', 'summarize', 'query')),
    input_text TEXT NOT NULL,
    result_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.saved_queries ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own saved queries"
ON public.saved_queries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved queries"
ON public.saved_queries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved queries"
ON public.saved_queries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved queries"
ON public.saved_queries
FOR DELETE
USING (auth.uid() = user_id);
