-- TrackMe Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activity sessions (automatic tracking)
CREATE TABLE IF NOT EXISTS activity_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile')) NOT NULL,
  device_id TEXT NOT NULL,
  app_name TEXT NOT NULL,
  app_bundle_id TEXT,
  window_title TEXT,
  url TEXT,
  file_path TEXT,
  auto_category TEXT,
  auto_project TEXT,
  productivity_score INTEGER CHECK (productivity_score >= 0 AND productivity_score <= 100),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  is_idle BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Manual check-ins (user-reported activities)
CREATE TABLE IF NOT EXISTS manual_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  activity_type TEXT NOT NULL,
  activity_description TEXT,
  category TEXT NOT NULL,
  project_id UUID,
  productivity_score INTEGER CHECK (productivity_score >= 0 AND productivity_score <= 100),
  location TEXT,
  is_meeting BOOLEAN DEFAULT false,
  meeting_attendees TEXT[],
  triggered_by TEXT CHECK (triggered_by IN ('idle_return', 'periodic', 'gap_detected', 'manual')) NOT NULL,
  device_was_idle BOOLEAN DEFAULT false,
  prompt_time TIMESTAMP WITH TIME ZONE NOT NULL,
  response_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Check-in templates
CREATE TABLE IF NOT EXISTS checkin_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  default_duration INTEGER NOT NULL,
  productivity_score INTEGER CHECK (productivity_score >= 0 AND productivity_score <= 100),
  is_frequent BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Check-in settings
CREATE TABLE IF NOT EXISTS checkin_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  idle_threshold_minutes INTEGER DEFAULT 15,
  periodic_interval_minutes INTEGER DEFAULT 120,
  periodic_enabled BOOLEAN DEFAULT false,
  periodic_work_hours_only BOOLEAN DEFAULT true,
  ask_before_lunch BOOLEAN DEFAULT false,
  ask_after_work BOOLEAN DEFAULT true,
  gap_detection_enabled BOOLEAN DEFAULT true,
  min_gap_minutes INTEGER DEFAULT 10,
  snooze_duration_minutes INTEGER DEFAULT 30,
  notification_method TEXT CHECK (notification_method IN ('popup', 'notification', 'both')) DEFAULT 'both',
  require_category BOOLEAN DEFAULT false,
  remember_recent_activities BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categorization rules
CREATE TABLE IF NOT EXISTS categorization_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  app_pattern TEXT NOT NULL,
  title_pattern TEXT,
  url_pattern TEXT,
  category TEXT NOT NULL,
  productivity_score INTEGER CHECK (productivity_score >= 0 AND productivity_score <= 100),
  confidence REAL DEFAULT 1.0,
  is_learned BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Auto-detected projects
CREATE TABLE IF NOT EXISTS auto_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  detected_from TEXT CHECK (detected_from IN ('window_title', 'file_path', 'url')) NOT NULL,
  pattern TEXT NOT NULL,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL,
  total_time_seconds INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  confidence REAL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  work_hours_start TIME DEFAULT '09:00',
  work_hours_end TIME DEFAULT '17:00',
  work_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
  timezone TEXT DEFAULT 'UTC',
  track_urls BOOLEAN DEFAULT true,
  track_titles BOOLEAN DEFAULT true,
  auto_pause_on_idle BOOLEAN DEFAULT true,
  idle_timeout_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Daily summaries
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_active_time INTEGER DEFAULT 0,
  total_productive_time INTEGER DEFAULT 0,
  device_breakdown JSONB DEFAULT '{}'::jsonb,
  app_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_sessions_user_id ON activity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_start_time ON activity_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_user_time ON activity_sessions(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_manual_checkins_user_id ON manual_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_checkins_start_time ON manual_checkins(start_time);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date ON daily_summaries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_auto_projects_user_id ON auto_projects(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Activity sessions: Users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON activity_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON activity_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON activity_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON activity_sessions FOR DELETE USING (auth.uid() = user_id);

-- Manual check-ins: Users can only access their own check-ins
CREATE POLICY "Users can view own checkins" ON manual_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON manual_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON manual_checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checkins" ON manual_checkins FOR DELETE USING (auth.uid() = user_id);

-- Check-in templates: Users can access global templates (user_id IS NULL) and their own
CREATE POLICY "Users can view templates" ON checkin_templates FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can insert own templates" ON checkin_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON checkin_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON checkin_templates FOR DELETE USING (auth.uid() = user_id);

-- Check-in settings: Users can only access their own settings
CREATE POLICY "Users can view own settings" ON checkin_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON checkin_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON checkin_settings FOR UPDATE USING (auth.uid() = user_id);

-- Categorization rules: Users can access global rules (user_id IS NULL) and their own
CREATE POLICY "Users can view rules" ON categorization_rules FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can insert own rules" ON categorization_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rules" ON categorization_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rules" ON categorization_rules FOR DELETE USING (auth.uid() = user_id);

-- Auto projects: Users can only access their own projects
CREATE POLICY "Users can view own projects" ON auto_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON auto_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON auto_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON auto_projects FOR DELETE USING (auth.uid() = user_id);

-- User preferences: Users can only access their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Daily summaries: Users can only access their own summaries
CREATE POLICY "Users can view own summaries" ON daily_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own summaries" ON daily_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own summaries" ON daily_summaries FOR UPDATE USING (auth.uid() = user_id);

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_sessions_updated_at BEFORE UPDATE ON activity_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkin_settings_updated_at BEFORE UPDATE ON checkin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  INSERT INTO checkin_settings (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
