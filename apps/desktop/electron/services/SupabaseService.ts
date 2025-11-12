import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ActivitySession, ManualCheckIn } from '@trackme/shared';

export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async saveSessions(sessions: ActivitySession[]): Promise<void> {
    const { error } = await this.client
      .from('activity_sessions')
      .upsert(sessions, { onConflict: 'id' });

    if (error) {
      throw new Error(`Failed to save sessions: ${error.message}`);
    }
  }

  async saveCheckIn(checkIn: ManualCheckIn): Promise<void> {
    const { error } = await this.client
      .from('manual_checkins')
      .insert(checkIn);

    if (error) {
      throw new Error(`Failed to save check-in: ${error.message}`);
    }
  }

  async getSessions(userId: string, startDate: Date, endDate: Date): Promise<ActivitySession[]> {
    const { data, error } = await this.client
      .from('activity_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .order('start_time', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch sessions: ${error.message}`);
    }

    return data || [];
  }

  async getCheckIns(userId: string, startDate: Date, endDate: Date): Promise<ManualCheckIn[]> {
    const { data, error } = await this.client
      .from('manual_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .order('start_time', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch check-ins: ${error.message}`);
    }

    return data || [];
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
