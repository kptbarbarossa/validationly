-- Validationly Complete Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
  plan VARCHAR DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  credits_remaining INTEGER DEFAULT 3,
  total_validations INTEGER DEFAULT 0,
  stripe_customer_id VARCHAR,
  subscription_status VARCHAR,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Validation history
CREATE TABLE public.validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  idea_text TEXT NOT NULL,
  demand_score INTEGER CHECK (demand_score >= 0 AND demand_score <= 100),
  category VARCHAR,
  business_model VARCHAR,
  target_market VARCHAR,
  analysis_result JSONB,
  platform_analyses JSONB,
  real_world_data JSONB,
  insights JSONB,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  validation_type VARCHAR DEFAULT 'standard' CHECK (validation_type IN ('fast', 'standard', 'premium')),
  processing_time INTEGER, -- milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliation applications
CREATE TABLE public.affiliation_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR NOT NULL,
  user_name VARCHAR NOT NULL,
  site_link VARCHAR NOT NULL,
  message TEXT,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics and usage tracking
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_type VARCHAR NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature usage tracking
CREATE TABLE public.feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  feature_name VARCHAR NOT NULL,
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved idea collections
CREATE TABLE public.idea_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Many-to-many relationship between collections and validations
CREATE TABLE public.collection_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES public.idea_collections(id) ON DELETE CASCADE,
  validation_id UUID REFERENCES public.validations(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, validation_id)
);

-- Team workspaces (for business plan)
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan VARCHAR DEFAULT 'business' CHECK (plan IN ('business', 'enterprise')),
  max_members INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace members
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Validation comments (for team collaboration)
CREATE TABLE public.validation_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_id UUID REFERENCES public.validations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_validations_user_id ON public.validations(user_id);
CREATE INDEX idx_validations_created_at ON public.validations(created_at DESC);
CREATE INDEX idx_validations_demand_score ON public.validations(demand_score DESC);
CREATE INDEX idx_validations_category ON public.validations(category);
CREATE INDEX idx_validations_is_public ON public.validations(is_public) WHERE is_public = true;
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at DESC);
CREATE INDEX idx_affiliation_applications_created_at ON public.affiliation_applications(created_at DESC);
CREATE INDEX idx_affiliation_applications_status ON public.affiliation_applications(status);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Validations policies
CREATE POLICY "Users can view own validations" ON public.validations
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own validations" ON public.validations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own validations" ON public.validations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own validations" ON public.validations
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feature usage policies
CREATE POLICY "Users can view own feature usage" ON public.feature_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feature usage" ON public.feature_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Affiliation applications policies (admin can view all, anyone can insert)
CREATE POLICY "Anyone can submit affiliation applications" ON public.affiliation_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all affiliation applications" ON public.affiliation_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'mustafakoklu@gmail.com'
    )
  );

CREATE POLICY "Admin can update affiliation applications" ON public.affiliation_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'mustafakoklu@gmail.com'
    )
  );

CREATE POLICY "Admin can delete affiliation applications" ON public.affiliation_applications
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'mustafakoklu@gmail.com'
    )
  );

-- Collections policies
CREATE POLICY "Users can manage own collections" ON public.idea_collections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections" ON public.idea_collections
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Collection validations policies
CREATE POLICY "Users can manage own collection validations" ON public.collection_validations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.idea_collections 
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );

-- Functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_validations_updated_at BEFORE UPDATE ON public.validations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_idea_collections_updated_at BEFORE UPDATE ON public.idea_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Views for analytics
CREATE VIEW public.user_stats AS
SELECT 
  u.id,
  u.email,
  u.plan,
  u.created_at as user_since,
  u.total_validations,
  u.credits_remaining,
  COUNT(v.id) as validation_count,
  AVG(v.demand_score) as avg_score,
  COUNT(CASE WHEN v.created_at >= CURRENT_DATE THEN 1 END) as today_validations,
  COUNT(CASE WHEN v.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_validations,
  COUNT(CASE WHEN v.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_validations
FROM public.users u
LEFT JOIN public.validations v ON u.id = v.user_id
GROUP BY u.id, u.email, u.plan, u.created_at, u.total_validations, u.credits_remaining;

-- Daily usage statistics
CREATE VIEW public.daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_validations,
  COUNT(DISTINCT user_id) as active_users,
  AVG(demand_score) as avg_score,
  AVG(processing_time) as avg_processing_time
FROM public.validations
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Popular categories
CREATE VIEW public.category_stats AS
SELECT 
  category,
  COUNT(*) as validation_count,
  AVG(demand_score) as avg_score,
  COUNT(DISTINCT user_id) as unique_users
FROM public.validations
WHERE category IS NOT NULL
GROUP BY category
ORDER BY validation_count DESC;