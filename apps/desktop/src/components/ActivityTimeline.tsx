import { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { formatDuration } from '@trackme/shared';

interface ActivityTimelineProps {
  supabase: SupabaseClient;
  userId: string;
  period: 'today' | 'week';
}

interface Activity {
  id: string;
  name: string;
  category: string;
  startTime: Date;
  duration: number;
  type: 'session' | 'checkin';
}

export function ActivityTimeline({ supabase, userId, period }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [period, userId]);

  const loadActivities = async () => {
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

      // Fetch sessions
      const { data: sessions } = await supabase
        .from('activity_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', now.toISOString())
        .order('start_time', { ascending: false })
        .limit(20);

      // Fetch check-ins
      const { data: checkIns } = await supabase
        .from('manual_checkins')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', now.toISOString())
        .order('start_time', { ascending: false })
        .limit(20);

      const combined: Activity[] = [
        ...(sessions?.map((s) => ({
          id: s.id,
          name: s.window_title || s.app_name,
          category: s.auto_category || 'Uncategorized',
          startTime: new Date(s.start_time),
          duration: s.duration_seconds || 0,
          type: 'session' as const
        })) || []),
        ...(checkIns?.map((c) => ({
          id: c.id,
          name: c.activity_description || c.activity_type,
          category: c.category,
          startTime: new Date(c.start_time),
          duration: c.duration_minutes * 60,
          type: 'checkin' as const
        })) || [])
      ];

      combined.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

      setActivities(combined.slice(0, 15));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load activities:', error);
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Development: 'bg-green-100 text-green-800',
      Communication: 'bg-purple-100 text-purple-800',
      Meeting: 'bg-blue-100 text-blue-800',
      Break: 'bg-gray-100 text-gray-800',
      Design: 'bg-pink-100 text-pink-800',
      Email: 'bg-yellow-100 text-yellow-800',
      Browsing: 'bg-indigo-100 text-indigo-800',
      Entertainment: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No activity recorded yet
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'checkin' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                ></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {activity.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(
                          activity.category
                        )}`}
                      >
                        {activity.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {activity.startTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
