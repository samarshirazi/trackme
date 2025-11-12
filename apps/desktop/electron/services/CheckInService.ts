import { BrowserWindow } from 'electron';
import {
  CheckInPromptData,
  CheckInResponse,
  CheckInSettings,
  DEFAULT_CHECKIN_TEMPLATES
} from '@trackme/shared';
import { SupabaseService } from './SupabaseService';
import { v4 as uuidv4 } from 'uuid';

export class CheckInService {
  private userId: string;
  private lastActiveTime: Date = new Date();
  private checkInterval: NodeJS.Timeout | null = null;
  private snoozedUntil: Date | null = null;
  private settings: CheckInSettings;
  private supabase: SupabaseService;
  private pendingPrompt: CheckInPromptData | null = null;

  constructor(userId: string) {
    this.userId = userId;
    this.supabase = new SupabaseService();

    // Default settings
    this.settings = {
      user_id: userId,
      enabled: true,
      idle_threshold_minutes: 15,
      periodic_interval_minutes: 120,
      periodic_enabled: false,
      periodic_work_hours_only: true,
      ask_before_lunch: false,
      ask_after_work: true,
      gap_detection_enabled: true,
      min_gap_minutes: 10,
      snooze_duration_minutes: 30,
      notification_method: 'popup',
      require_category: false,
      remember_recent_activities: true
    };

    this.loadSettings();
  }

  private async loadSettings() {
    try {
      const { data } = await this.supabase
        .getClient()
        .from('checkin_settings')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (data) {
        this.settings = data;
      }
    } catch (error) {
      console.error('[CheckInService] Failed to load settings:', error);
    }
  }

  start() {
    if (!this.settings.enabled) return;

    console.log('[CheckInService] Starting...');

    // Check for idle → active transitions every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkForCheckIn();
    }, 30000);

    console.log('[CheckInService] Started');
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('[CheckInService] Stopped');
  }

  private checkForCheckIn() {
    const now = new Date();

    // Skip if snoozed
    if (this.snoozedUntil && now < this.snoozedUntil) {
      return;
    }

    // Check if there was a gap (device idle period)
    const timeSinceLastActive = (now.getTime() - this.lastActiveTime.getTime()) / 1000 / 60; // minutes

    if (timeSinceLastActive >= this.settings.idle_threshold_minutes) {
      // User was away and just returned
      this.triggerCheckIn({
        type: 'idle_return',
        startTime: this.lastActiveTime,
        endTime: now,
        duration: Math.round(timeSinceLastActive),
        suggestions: this.getSuggestions(timeSinceLastActive, now)
      });
    }

    // Update last active time
    this.lastActiveTime = now;
  }

  private getSuggestions(duration: number, time: Date) {
    const suggestions = [];
    const hour = time.getHours();

    // Time-based suggestions
    if (hour >= 12 && hour <= 14) {
      // Lunch time
      const lunchTemplate = DEFAULT_CHECKIN_TEMPLATES.find((t) => t.name === 'Lunch Break');
      if (lunchTemplate) {
        suggestions.push({
          name: lunchTemplate.name,
          type: 'break',
          emoji: lunchTemplate.emoji,
          category: lunchTemplate.category,
          defaultDuration: lunchTemplate.default_duration,
          productivity: lunchTemplate.productivity_score
        });
      }
    }

    // Duration-based suggestions
    if (duration < 10) {
      // Short break
      const coffeeTemplate = DEFAULT_CHECKIN_TEMPLATES.find((t) => t.name === 'Coffee Break');
      if (coffeeTemplate) {
        suggestions.push({
          name: coffeeTemplate.name,
          type: 'break',
          emoji: coffeeTemplate.emoji,
          category: coffeeTemplate.category,
          defaultDuration: coffeeTemplate.default_duration,
          productivity: coffeeTemplate.productivity_score
        });
      }
    }

    // Add frequent templates
    DEFAULT_CHECKIN_TEMPLATES.filter((t) => t.is_frequent)
      .slice(0, 6)
      .forEach((template) => {
        if (!suggestions.find((s) => s.name === template.name)) {
          suggestions.push({
            name: template.name,
            type: template.category.toLowerCase(),
            emoji: template.emoji,
            category: template.category,
            defaultDuration: template.default_duration,
            productivity: template.productivity_score
          });
        }
      });

    return suggestions.slice(0, 6);
  }

  private triggerCheckIn(promptData: CheckInPromptData) {
    console.log('[CheckInService] Triggering check-in prompt:', promptData);

    this.pendingPrompt = promptData;

    // Get main window or create check-in window
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].webContents.send('show-checkin-prompt', promptData);
    }
  }

  async submitCheckIn(response: CheckInResponse) {
    if (!this.pendingPrompt) return;

    try {
      const checkIn = {
        id: uuidv4(),
        user_id: this.userId,
        start_time: response.startTime.toISOString(),
        end_time: response.endTime.toISOString(),
        duration_minutes: response.duration,
        activity_type: response.activityType,
        activity_description: response.activityDescription,
        category: response.category,
        productivity_score: this.getProductivityForActivity(response.activityType),
        is_meeting: response.isMeeting,
        location: response.location,
        triggered_by: this.pendingPrompt.type,
        device_was_idle: true,
        prompt_time: new Date().toISOString(),
        response_time: new Date().toISOString()
      };

      await this.supabase.saveCheckIn(checkIn);

      console.log('[CheckInService] Check-in saved successfully');

      this.pendingPrompt = null;
    } catch (error) {
      console.error('[CheckInService] Failed to save check-in:', error);
      throw error;
    }
  }

  private getProductivityForActivity(activityType: string): number {
    const template = DEFAULT_CHECKIN_TEMPLATES.find((t) => t.name === activityType);
    return template?.productivity_score || 50;
  }

  snooze(duration: number) {
    this.snoozedUntil = new Date(Date.now() + duration * 60 * 1000);
    console.log(`[CheckInService] Snoozed until ${this.snoozedUntil.toISOString()}`);
    this.pendingPrompt = null;
  }

  skip() {
    console.log('[CheckInService] Check-in skipped');
    this.pendingPrompt = null;
  }

  updateLastActiveTime() {
    this.lastActiveTime = new Date();
  }
}
