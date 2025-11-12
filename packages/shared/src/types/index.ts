// Database Types
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
}

export interface ActivitySession {
  id: string;
  user_id: string;
  device_type: 'desktop' | 'mobile';
  device_id: string;
  app_name: string;
  app_bundle_id?: string;
  window_title?: string;
  url?: string;
  file_path?: string;
  auto_category?: string;
  auto_project?: string;
  productivity_score?: number;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  is_idle: boolean;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface ManualCheckIn {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  activity_type: string;
  activity_description?: string;
  category: string;
  project_id?: string;
  productivity_score: number;
  location?: string;
  is_meeting: boolean;
  meeting_attendees?: string[];
  triggered_by: 'idle_return' | 'periodic' | 'gap_detected' | 'manual';
  device_was_idle: boolean;
  prompt_time: string;
  response_time?: string;
  created_at?: string;
}

export interface CheckInTemplate {
  id: string;
  user_id?: string;
  name: string;
  category: string;
  default_duration: number;
  productivity_score: number;
  is_frequent: boolean;
  usage_count: number;
  emoji: string;
  color: string;
}

export interface CheckInSettings {
  user_id: string;
  enabled: boolean;
  idle_threshold_minutes: number;
  periodic_interval_minutes: number;
  periodic_enabled: boolean;
  periodic_work_hours_only: boolean;
  ask_before_lunch: boolean;
  ask_after_work: boolean;
  gap_detection_enabled: boolean;
  min_gap_minutes: number;
  snooze_duration_minutes: number;
  notification_method: 'popup' | 'notification' | 'both';
  require_category: boolean;
  remember_recent_activities: boolean;
}

export interface CategorizationRule {
  id: string;
  user_id?: string;
  app_pattern: string;
  title_pattern?: string;
  url_pattern?: string;
  category: string;
  productivity_score: number;
  confidence: number;
  is_learned: boolean;
  usage_count: number;
}

export interface AutoProject {
  id: string;
  user_id: string;
  name: string;
  detected_from: 'window_title' | 'file_path' | 'url';
  pattern: string;
  first_seen: string;
  last_seen: string;
  total_time_seconds: number;
  is_active: boolean;
  confidence: number;
}

// Activity Monitor Types
export interface ActiveWindow {
  owner: {
    name: string;
    bundleId?: string;
    processId: number;
  };
  title: string;
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  url?: string;
  memoryUsage?: number;
}

export interface ActivityContext {
  appName: string;
  bundleId?: string;
  title: string;
  url?: string;
  filePath?: string;
  timeOfDay: number;
  dayOfWeek: number;
  duration: number;
  lastActivity?: string;
}

// Check-in Types
export interface CheckInPromptData {
  type: 'idle_return' | 'periodic' | 'gap_detected';
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  suggestions: CheckInSuggestion[];
}

export interface CheckInSuggestion {
  name: string;
  type: string;
  emoji: string;
  category: string;
  defaultDuration: number;
  productivity: number;
  fromCalendar?: boolean;
  attendees?: string[];
}

export interface CheckInResponse {
  activityType: string;
  activityDescription?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  category: string;
  isMeeting: boolean;
  location?: string;
}

// Settings Types
export interface UserPreferences {
  user_id: string;
  work_hours_start: string;
  work_hours_end: string;
  work_days: number[];
  timezone: string;
  track_urls: boolean;
  track_titles: boolean;
  auto_pause_on_idle: boolean;
  idle_timeout_minutes: number;
}

// Stats Types
export interface DailySummary {
  id: string;
  user_id: string;
  date: string;
  total_active_time: number;
  total_productive_time: number;
  device_breakdown: Record<string, number>;
  app_breakdown: Record<string, number>;
  created_at: string;
}

export interface ActivityStats {
  totalTime: number;
  productiveTime: number;
  neutralTime: number;
  unproductiveTime: number;
  topApps: Array<{ name: string; duration: number; percentage: number }>;
  topProjects: Array<{ name: string; duration: number; percentage: number }>;
  topCategories: Array<{ name: string; duration: number; percentage: number }>;
}
