-- Add tech stack and other details columns to proposals
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tech_frontend JSONB DEFAULT '[]';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tech_backend JSONB DEFAULT '[]';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tech_database JSONB DEFAULT '[]';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tech_ai_tools JSONB DEFAULT '[]';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tech_integrations JSONB DEFAULT '[]';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS other_details TEXT;
