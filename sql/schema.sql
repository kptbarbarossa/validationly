-- Job Tailor Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  plan VARCHAR DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id VARCHAR,
  subscription_status VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV rewrites tracking
CREATE TABLE cv_rewrites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR,
  company_name VARCHAR,
  industry VARCHAR,
  tone VARCHAR NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  success_rating INTEGER CHECK (success_rating >= 1 AND success_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications tracking
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_url VARCHAR,
  company_name VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR DEFAULT 'applied' CHECK (status IN ('applied', 'interview', 'rejected', 'offer', 'accepted')),
  cv_version_used TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job postings cache (for scraping)
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR,
  salary_range VARCHAR,
  job_type VARCHAR, -- full-time, part-time, contract, etc.
  industry VARCHAR,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferred_industries VARCHAR[],
  preferred_locations VARCHAR[],
  salary_min INTEGER,
  salary_max INTEGER,
  job_types VARCHAR[],
  notification_settings JSONB DEFAULT '{"email": true, "browser": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_cv_rewrites_user_id ON cv_rewrites(user_id);
CREATE INDEX idx_cv_rewrites_created_at ON cv_rewrites(created_at);
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_postings_company ON job_postings(company);
CREATE INDEX idx_job_postings_industry ON job_postings(industry);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_rewrites ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- CV rewrites policies
CREATE POLICY "Users can view own cv_rewrites" ON cv_rewrites
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own cv_rewrites" ON cv_rewrites
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Job applications policies
CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own applications" ON job_applications
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Functions
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional)
-- INSERT INTO users (email, plan) VALUES 
--   ('demo@example.com', 'free'),
--   ('pro@example.com', 'pro');

-- Views for analytics
CREATE VIEW user_analytics AS
SELECT 
  u.id,
  u.email,
  u.plan,
  u.created_at as user_since,
  COUNT(cr.id) as total_rewrites,
  COUNT(CASE WHEN cr.created_at >= CURRENT_DATE THEN 1 END) as today_rewrites,
  COUNT(ja.id) as total_applications,
  AVG(cr.success_rating) as avg_rating
FROM users u
LEFT JOIN cv_rewrites cr ON u.id = cr.user_id
LEFT JOIN job_applications ja ON u.id = ja.user_id
GROUP BY u.id, u.email, u.plan, u.created_at;

-- Usage statistics view
CREATE VIEW daily_usage_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_rewrites,
  COUNT(DISTINCT user_id) as active_users,
  AVG(tokens_used) as avg_tokens
FROM cv_rewrites
GROUP BY DATE(created_at)
ORDER BY date DESC;