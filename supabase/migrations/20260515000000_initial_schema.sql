-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- USERS (synced from Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@iqm.com'),
  name TEXT,
  department TEXT,
  avatar_url TEXT,
  notification_pref JSONB DEFAULT '{"slack": true, "email": false}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- USER ROLES (many-to-many)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('submitter', 'reviewer', 'chair', 'admin')),
  granted_at TIMESTAMPTZ DEFAULT now(),
  granted_by UUID REFERENCES users(id),
  PRIMARY KEY (user_id, role)
);

-- PROPOSALS
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL CHECK (length(title) <= 50),
  department TEXT NOT NULL,
  problem_statement TEXT NOT NULL CHECK (length(problem_statement) <= 500),
  proposed_solution TEXT NOT NULL CHECK (length(proposed_solution) <= 500),
  expected_impact TEXT NOT NULL CHECK (length(expected_impact) <= 300),
  current_status TEXT CHECK (current_status IN ('idea', 'exploring', 'partial', 'nearly_complete', 'stuck')),
  urgency TEXT CHECK (urgency IN ('two_weeks', 'one_month', 'one_quarter', 'no_deadline')),
  urgency_reason TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  guidelines_version TEXT,
  submitted_at TIMESTAMPTZ,
  last_reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PROPOSAL SUPPORT NEEDS (multi-select)
CREATE TABLE IF NOT EXISTS proposal_support_needs (
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  support_type TEXT NOT NULL,
  other_text TEXT,
  PRIMARY KEY (proposal_id, support_type)
);

-- COMMENTS (threaded feed)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  parent_comment_id UUID REFERENCES comments(id),
  body TEXT NOT NULL,
  recommendation TEXT CHECK (recommendation IN (NULL, 'approve', 'approve_with_conditions', 'needs_more_info', 'reject')),
  conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- MEETINGS
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INT DEFAULT 30,
  google_event_id TEXT,
  attendees JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- VERDICTS (one per proposal)
CREATE TABLE IF NOT EXISTS verdicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) UNIQUE,
  chair_id UUID REFERENCES users(id),
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'approved_with_conditions', 'parked', 'rejected')),
  rationale TEXT NOT NULL,
  conditions TEXT,
  decided_at TIMESTAMPTZ DEFAULT now()
);

-- AI REVIEWS (versioned)
CREATE TABLE IF NOT EXISTS ai_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  version INT NOT NULL,
  summary TEXT,
  strengths JSONB,
  concerns JSONB,
  feasibility TEXT CHECK (feasibility IN ('low', 'medium', 'high')),
  feasibility_rationale TEXT,
  similar_proposals JSONB,
  suggested_questions JSONB,
  guideline_alignment JSONB,
  generated_at TIMESTAMPTZ DEFAULT now(),
  generated_by TEXT DEFAULT 'mcp:iqm-skill:proposal-review'
);

-- SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  type TEXT,
  description TEXT,
  status TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- OUTCOMES
CREATE TABLE IF NOT EXISTS outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) UNIQUE,
  shipped_at TIMESTAMPTZ,
  metrics JSONB,
  notes TEXT,
  logged_by UUID REFERENCES users(id),
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- GUIDELINES
CREATE TABLE IF NOT EXISTS guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT UNIQUE NOT NULL,
  effective_from DATE NOT NULL,
  sections JSONB,
  checkpoints JSONB,
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only one active guideline at a time
CREATE UNIQUE INDEX IF NOT EXISTS one_active_guideline ON guidelines (is_active) WHERE is_active = true;

-- ACTIVITY LOG (append-only)
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PROPOSAL EMBEDDINGS (for duplicate detection)
CREATE TABLE IF NOT EXISTS proposal_embeddings (
  proposal_id UUID PRIMARY KEY REFERENCES proposals(id) ON DELETE CASCADE,
  embedding vector(1536),
  text_source TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_submitter ON proposals(submitter_id);
CREATE INDEX IF NOT EXISTS idx_proposals_department ON proposals(department);
CREATE INDEX IF NOT EXISTS idx_proposals_submitted_at ON proposals(submitted_at);
CREATE INDEX IF NOT EXISTS idx_comments_proposal ON comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_proposal ON activity_log(proposal_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at);

-- RPC FUNCTIONS for analytics
CREATE OR REPLACE FUNCTION get_proposal_counts_by_status()
RETURNS TABLE(status TEXT, count BIGINT) AS $$
  SELECT status, COUNT(*) FROM proposals GROUP BY status;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION get_proposal_counts_by_department()
RETURNS TABLE(department TEXT, count BIGINT) AS $$
  SELECT department, COUNT(*) FROM proposals GROUP BY department;
$$ LANGUAGE sql;
