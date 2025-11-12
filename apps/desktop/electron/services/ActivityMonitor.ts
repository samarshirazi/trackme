import activeWin from 'active-win';
import { ActivitySession, ActivityContext } from '@trackme/shared';
import { CategorizationEngine } from './CategorizationEngine';
import { SupabaseService } from './SupabaseService';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

interface SessionCache {
  current: ActivitySession | null;
  lastSync: number;
  queue: ActivitySession[];
}

export class ActivityMonitor {
  private userId: string;
  private deviceId: string;
  private monitorInterval: NodeJS.Timeout | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private paused: boolean = false;
  private lastActiveTime: Date = new Date();
  private sessionCache: SessionCache;
  private categorizationEngine: CategorizationEngine;
  private supabase: SupabaseService;
  private idleThreshold: number = 5 * 60 * 1000; // 5 minutes in ms

  constructor(userId: string) {
    this.userId = userId;
    this.deviceId = this.getDeviceId();
    this.sessionCache = {
      current: null,
      lastSync: Date.now(),
      queue: []
    };
    this.categorizationEngine = new CategorizationEngine();
    this.supabase = new SupabaseService();
  }

  private getDeviceId(): string {
    // Create unique device identifier
    return `${os.hostname()}-${os.platform()}-${os.arch()}`;
  }

  async start() {
    console.log('[ActivityMonitor] Starting...');

    // Monitor active window every 3 seconds
    this.monitorInterval = setInterval(() => {
      this.monitorActivity();
    }, 3000);

    // Sync to Supabase every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncToSupabase();
    }, 30000);

    console.log('[ActivityMonitor] Started successfully');
  }

  stop() {
    console.log('[ActivityMonitor] Stopping...');

    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Save current session before stopping
    if (this.sessionCache.current) {
      this.endCurrentSession();
    }

    // Final sync
    this.syncToSupabase();

    console.log('[ActivityMonitor] Stopped');
  }

  pause() {
    this.paused = true;
    this.endCurrentSession();
    console.log('[ActivityMonitor] Paused');
  }

  resume() {
    this.paused = false;
    this.lastActiveTime = new Date();
    console.log('[ActivityMonitor] Resumed');
  }

  isPaused(): boolean {
    return this.paused;
  }

  private async monitorActivity() {
    if (this.paused) return;

    try {
      const window = await activeWin();

      if (!window) {
        // No active window, might be idle
        this.handleIdle();
        return;
      }

      // Check for idle time
      const now = new Date();
      const idleTime = now.getTime() - this.lastActiveTime.getTime();

      if (idleTime > this.idleThreshold) {
        this.handleIdle();
        return;
      }

      // Update last active time
      this.lastActiveTime = now;

      // Track this activity
      await this.trackActivity(window);
    } catch (error) {
      console.error('[ActivityMonitor] Error monitoring activity:', error);
    }
  }

  private async trackActivity(window: any) {
    const context: ActivityContext = {
      appName: window.owner.name,
      bundleId: window.owner.bundleId,
      title: window.title || '',
      url: window.url,
      timeOfDay: new Date().getHours() + new Date().getMinutes() / 60,
      dayOfWeek: new Date().getDay(),
      duration: 0
    };

    // Auto-categorize
    const category = await this.categorizationEngine.categorize(context);
    const project = this.categorizationEngine.detectProject(context);
    const productivity = this.categorizationEngine.getProductivityScore(context, category);

    // Check if we should continue current session or start new one
    if (this.shouldContinueSession(context, category)) {
      // Update existing session
      this.updateCurrentSession();
    } else {
      // End current session and start new one
      this.endCurrentSession();
      this.startNewSession(context, category, project, productivity);
    }
  }

  private shouldContinueSession(context: ActivityContext, category: string): boolean {
    if (!this.sessionCache.current) return false;

    const current = this.sessionCache.current;

    // Same app and category
    return (
      current.app_name === context.appName &&
      current.auto_category === category &&
      current.window_title === context.title
    );
  }

  private startNewSession(
    context: ActivityContext,
    category: string,
    project: string | null,
    productivity: number
  ) {
    const now = new Date();

    this.sessionCache.current = {
      id: uuidv4(),
      user_id: this.userId,
      device_type: 'desktop',
      device_id: this.deviceId,
      app_name: context.appName,
      app_bundle_id: context.bundleId,
      window_title: context.title,
      url: context.url,
      auto_category: category,
      auto_project: project || undefined,
      productivity_score: productivity,
      start_time: now.toISOString(),
      is_idle: false,
      metadata: {}
    };
  }

  private updateCurrentSession() {
    if (!this.sessionCache.current) return;

    const now = new Date();
    const startTime = new Date(this.sessionCache.current.start_time);
    const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    this.sessionCache.current.end_time = now.toISOString();
    this.sessionCache.current.duration_seconds = duration;
  }

  private endCurrentSession() {
    if (!this.sessionCache.current) return;

    this.updateCurrentSession();

    // Add to queue for sync
    this.sessionCache.queue.push({ ...this.sessionCache.current });

    this.sessionCache.current = null;
  }

  private handleIdle() {
    // End current session if exists
    this.endCurrentSession();

    // Update last active time
    this.lastActiveTime = new Date();
  }

  private async syncToSupabase() {
    if (this.sessionCache.queue.length === 0) return;

    try {
      console.log(`[ActivityMonitor] Syncing ${this.sessionCache.queue.length} sessions...`);

      const sessions = [...this.sessionCache.queue];
      await this.supabase.saveSessions(sessions);

      // Clear queue after successful sync
      this.sessionCache.queue = [];
      this.sessionCache.lastSync = Date.now();

      console.log('[ActivityMonitor] Sync successful');
    } catch (error) {
      console.error('[ActivityMonitor] Sync failed:', error);
      // Keep sessions in queue for retry
    }
  }

  getTodayStats() {
    // Get stats for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = this.sessionCache.queue.filter((session) => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= today;
    });

    const totalSeconds = sessions.reduce((sum, session) => {
      return sum + (session.duration_seconds || 0);
    }, 0);

    // Add current session if active
    if (this.sessionCache.current) {
      const now = new Date();
      const start = new Date(this.sessionCache.current.start_time);
      const currentDuration = Math.floor((now.getTime() - start.getTime()) / 1000);
      totalSeconds += currentDuration;
    }

    return {
      totalSeconds,
      sessions: sessions.length
    };
  }
}
