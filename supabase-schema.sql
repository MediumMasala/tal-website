-- Supabase SQL Schema for Tal Leads
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_slug TEXT NOT NULL,
  company_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_workplace TEXT,
  basic_ask TEXT NOT NULL,
  page_url TEXT,
  utm_raw TEXT,
  ai_title TEXT,
  ai_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_company_slug ON leads(company_slug);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp_number);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows insert from authenticated service role
CREATE POLICY "Allow service role insert" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows select from authenticated service role
CREATE POLICY "Allow service role select" ON leads
  FOR SELECT
  USING (true);

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW lead_analytics AS
SELECT
  company_slug,
  company_name,
  COUNT(*) as total_leads,
  COUNT(DISTINCT whatsapp_number) as unique_users,
  DATE(created_at) as date
FROM leads
GROUP BY company_slug, company_name, DATE(created_at)
ORDER BY date DESC;

-- Grant access to the view
GRANT SELECT ON lead_analytics TO authenticated;
GRANT SELECT ON lead_analytics TO service_role;
