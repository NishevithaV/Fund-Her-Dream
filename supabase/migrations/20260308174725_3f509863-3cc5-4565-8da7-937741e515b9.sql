
-- Create ideas table
CREATE TABLE public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  link TEXT,
  amount_raised INTEGER NOT NULL DEFAULT 0,
  backer_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contributions table
CREATE TABLE public.contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Ideas: everyone can read approved ideas
CREATE POLICY "Anyone can view approved ideas" ON public.ideas
  FOR SELECT USING (status = 'approved');

-- Ideas: anyone can insert (submit an idea)
CREATE POLICY "Anyone can submit ideas" ON public.ideas
  FOR INSERT WITH CHECK (true);

-- Ideas: service role can update (for incrementing amounts)
CREATE POLICY "Service role can update ideas" ON public.ideas
  FOR UPDATE USING (true) WITH CHECK (true);

-- Contributions: anyone can read
CREATE POLICY "Anyone can view contributions" ON public.contributions
  FOR SELECT USING (true);

-- Contributions: anyone can insert
CREATE POLICY "Anyone can insert contributions" ON public.contributions
  FOR INSERT WITH CHECK (true);
