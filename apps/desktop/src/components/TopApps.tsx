import { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { formatDuration } from '@trackme/shared';

interface TopAppsProps {
  supabase: SupabaseClient;
  userId: string;
  period: 'today' | 'week';
}

interface AppData {
  name: string;
  duration: number;
  percentage: number;
}

export function TopApps({ supabase, userId, period }: TopAppsProps) {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, [period, userId]);

  const loadApps = async () => {
    try {
      const now = new Date();
      let startDate = new Date();

      if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else {
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
      }

      const { data: sessions } = await supabase
        .from('activity_sessions')
        .select('app_name, duration_seconds')
        .eq('user_id', userId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', now.toISOString());

      const appMap = new Map<string, number>();
      let totalDuration = 0;

      sessions?.forEach((session) => {
        const duration = session.duration_seconds || 0;
        appMap.set(session.app_name, (appMap.get(session.app_name) || 0) + duration);
        totalDuration += duration;
      });

      const topApps = Array.from(appMap.entries())
        .map(([name, duration]) => ({
          name,
          duration,
          percentage: totalDuration > 0 ? (duration / totalDuration) * 100 : 0
        }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);

      setApps(topApps);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load apps:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Apps</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Apps</h3>

      {apps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No activity recorded yet
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app, index) => (
            <div key={app.name} className="flex items-center">
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-sm font-medium text-gray-600">{index + 1}</span>
              </div>
              <div className="flex-1 ml-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{app.name}</span>
                  <span className="text-sm text-gray-600">{formatDuration(app.duration)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${app.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
