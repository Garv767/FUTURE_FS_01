-- Supabase Schema for Dynamic Portfolio (Shared Project Version)

-- Create the table with a prefix to avoid collisions in a shared project
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    repo_name TEXT UNIQUE NOT NULL,
    display_title TEXT,
    custom_description TEXT,
    custom_image_url TEXT,
    demo_url TEXT,
    is_visible BOOLEAN DEFAULT false, -- Start as hidden in a shared project to be safe
    priority INTEGER DEFAULT 999,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Anyone can read visible projects
CREATE POLICY "Public Read Access" 
ON public.portfolio_projects FOR SELECT 
USING (is_visible = true OR auth.role() = 'authenticated');

-- 2. Only authenticated users can manage (CRUD) projects
CREATE POLICY "Authenticated Manage Access" 
ON public.portfolio_projects FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to auto-update the timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Table and trigger for portfolio_mission_logs
create table public.portfolio_mission_logs (
  id uuid not null default gen_random_uuid (),
  title text not null,
  category text not null,
  badge text not null default ''::text,
  date date not null,
  organization text not null default ''::text,
  description text not null default ''::text,
  highlights text[] not null default '{}'::text[],
  is_visible boolean not null default true,
  priority integer not null default 999,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint portfolio_mission_logs_pkey primary key (id),
  constraint portfolio_mission_logs_category_check check (
    (
      category = any (
        array[
          'hackathon'::text,
          'ctf'::text,
          'leadership'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

CREATE OR REPLACE FUNCTION update_portfolio_mission_logs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create trigger portfolio_mission_logs_updated_at BEFORE
update on portfolio_mission_logs for EACH row
execute FUNCTION update_portfolio_mission_logs_timestamp();

-- Table and trigger for portfolio_ats_config
CREATE TABLE public.portfolio_ats_config (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    config_key text NOT NULL,
    config_value jsonb NOT NULL,
    description text,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT portfolio_ats_config_pkey PRIMARY KEY (id),
    CONSTRAINT portfolio_ats_config_config_key_key UNIQUE (config_key)
) TABLESPACE pg_default;

CREATE OR REPLACE FUNCTION update_ats_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ats_config_updated_at BEFORE
UPDATE ON portfolio_ats_config FOR EACH ROW
EXECUTE FUNCTION update_ats_config_timestamp();
