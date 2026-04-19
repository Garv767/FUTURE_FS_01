-- ============================================================
-- CYBER PORTFOLIO — Supabase Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- TABLE 1: portfolio_mission_logs
-- Purpose: Stores hackathon achievements, CTF entries,
--          and leadership roles for the Mission Log page.
--          Editable via Admin Portal > [MISSIONS] tab.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_mission_logs (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT            NOT NULL,          -- e.g. "Hack & Hit"
  category      TEXT            NOT NULL           -- 'hackathon' | 'ctf' | 'leadership'
                CHECK (category IN ('hackathon', 'ctf', 'leadership')),
  badge         TEXT            NOT NULL DEFAULT '',  -- e.g. "FINALIST", "LEADERSHIP", "1ST PLACE"
  date          DATE            NOT NULL,
  organization  TEXT            NOT NULL DEFAULT '',  -- Hosting org / college
  description   TEXT            NOT NULL DEFAULT '',  -- Full detail (shown on expand)
  highlights    TEXT[]          NOT NULL DEFAULT '{}', -- Bullet points / flag names
  is_visible    BOOLEAN         NOT NULL DEFAULT true,
  priority      INTEGER         NOT NULL DEFAULT 999,  -- Display order (lower = higher)
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- Seed with known data
INSERT INTO portfolio_mission_logs (title, category, badge, date, organization, description, highlights, is_visible, priority) VALUES
(
  'Hack & Hit',
  'hackathon',
  'FINALIST',
  '2024-03-15',
  'SRM Institute of Science and Technology',
  'Competed in a 24-hour hackathon focused on cybersecurity and full-stack development. Reached the finalist round among 200+ teams.',
  ARRAY['Top-10 Finalist out of 200+ teams', 'Built a real-time threat detection dashboard', 'Used React, Go, and Supabase'],
  true,
  1
),
(
  'POKEVERSE Ideathon',
  'hackathon',
  'LEADERSHIP',
  '2024-01-20',
  'SRM Institute of Science and Technology',
  'Led a cross-functional team of 5 members in building a gamified learning platform pitched to a panel of industry judges.',
  ARRAY['Team Lead — 5 members', 'Pitched to panel of 8 industry experts', 'Developed full prototype in 12 hours'],
  true,
  2
),
(
  'CTF Competitions',
  'ctf',
  'PARTICIPANT',
  '2024-06-01',
  'Various',
  'Participated in multiple Capture The Flag competitions covering web exploitation, reverse engineering, cryptography, and OSINT.',
  ARRAY['Web Exploitation', 'Cryptography', 'OSINT', 'Reverse Engineering', 'Forensics'],
  true,
  3
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_portfolio_mission_logs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_mission_logs_updated_at
  BEFORE UPDATE ON portfolio_mission_logs
  FOR EACH ROW EXECUTE FUNCTION update_portfolio_mission_logs_timestamp();

-- ────────────────────────────────────────────────────────────
-- TABLE 2: portfolio_ats_config
-- Purpose: Stores ATS Resume Generator configuration —
--          skill weights and resume template sections.
--          Editable via Admin Portal > [ATS CONFIG] tab.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_ats_config (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key      TEXT        NOT NULL UNIQUE,  -- e.g. 'skill_weights', 'template_header'
  config_value    JSONB       NOT NULL,         -- flexible JSON payload
  description     TEXT        NOT NULL DEFAULT '',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed: skill weights (used to boost project scores in ATS matching)
INSERT INTO portfolio_ats_config (config_key, config_value, description) VALUES
(
  'skill_weights',
  '{
    "react": 2.0,
    "nextjs": 2.0,
    "typescript": 1.8,
    "go": 1.8,
    "golang": 1.8,
    "python": 1.5,
    "docker": 1.5,
    "kubernetes": 1.5,
    "security": 2.5,
    "ctf": 2.5,
    "penetration": 2.5,
    "supabase": 1.3,
    "postgresql": 1.3,
    "redis": 1.3,
    "javascript": 1.2,
    "node": 1.2,
    "api": 1.0,
    "rest": 1.0,
    "git": 0.8,
    "linux": 1.0
  }',
  'Multipliers applied to keyword matches during ATS project scoring. Higher = more weight.'
),
(
  'resume_personal',
  '{
    "name": "Garv Rahut",
    "email": "your.email@example.com",
    "phone": "+91-XXXXXXXXXX",
    "linkedin": "linkedin.com/in/garv767",
    "github": "github.com/garv767",
    "location": "Indore, India"
  }',
  'Personal details injected into every generated ATS resume PDF.'
),
(
  'resume_education',
  '[{
    "degree": "B.Tech in Computer Science and Engineering",
    "institution": "SRM Institute of Science and Technology, KTR",
    "year": "2022 – 2026",
    "gpa": "Update your GPA here"
  }]',
  'Education section for ATS resume. Array supports multiple entries.'
),
(
  'resume_skills',
  '{
    "languages": ["JavaScript", "TypeScript", "Go", "Python", "C++"],
    "frameworks": ["React", "Next.js", "Node.js", "Express"],
    "tools": ["Docker", "Git", "Supabase", "PostgreSQL", "Linux"],
    "security": ["CTF", "OSINT", "Web Exploitation", "Wireshark"]
  }',
  'Skills section rendered in the ATS resume output.'
),
(
  'resume_summary_template',
  '"Motivated Computer Science Engineer with hands-on experience in {top_skills}. Passionate about {focus_area}. Demonstrated ability to {achievement}."',
  'Summary template. {top_skills}, {focus_area}, {achievement} are filled by the ATS engine based on the JD.'
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_ats_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ats_config_updated_at
  BEFORE UPDATE ON portfolio_ats_config
  FOR EACH ROW EXECUTE FUNCTION update_ats_config_timestamp();

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Public: read-only for portfolio_mission_logs and portfolio_ats_config
-- Authenticated (admin): full CRUD
-- ────────────────────────────────────────────────────────────

-- portfolio_mission_logs RLS
ALTER TABLE portfolio_mission_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible missions"
  ON portfolio_mission_logs FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users have full access to missions"
  ON portfolio_mission_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- portfolio_ats_config RLS
ALTER TABLE portfolio_ats_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read portfolio_ats_config"
  ON portfolio_ats_config FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage portfolio_ats_config"
  ON portfolio_ats_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ────────────────────────────────────────────────────────────
-- DONE ✅
-- Tables created: portfolio_mission_logs, portfolio_ats_config
-- Seeds inserted with starter data
-- RLS policies applied
-- ────────────────────────────────────────────────────────────
