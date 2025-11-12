import { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { formatDuration } from '@trackme/shared';

interface ActivityStatsProps {
  supabase: SupabaseClient;
  userId: string;
  period: 'today' | 'week';
}

export function ActivityStats({ supabase, userId, period }: ActivityStatsProps) {
  const [stats, setStats] = useState({
    totalTime: 0,
    productiveTime: 0,
    sessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [period, userId]);

  const loadStats = async () => {
    try {
      const now = new Date();
      let startDate = new Date();

      if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else {
        // Start of week (Monday)
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
        .lte('start_time', now.toISOString());

      // Fetch manual check-ins
      const { data: checkIns } = await supabase
        .from('manual_checkins')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', now.toISOString());

      let totalTime = 0;
      let productiveTime = 0;

      // Calculate from sessions
      sessions?.forEach((session) => {
        const duration = session.duration_seconds || 0;
        totalTime += duration;
        if (session.productivity_score && session.productivity_score >= 70) {
          productiveTime += duration;
        }
      });

      // Calculate from check-ins
      checkIns?.forEach((checkIn) => {
        const duration = checkIn.duration_minutes * 60;
        totalTime += duration;
        if (checkIn.productivity_score && checkIn.productivity_score >= 70) {
          productiveTime += duration;
        }
      });

      setStats({
        totalTime,
        productiveTime,
        sessions: (sessions?.length || 0) + (checkIns?.length || 0)
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setLoading(false);
    }
  };

  const productivityPercentage = stats.totalTime > 0
    ? Math.round((stats.productiveTime / stats.totalTime) * 100)
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">Total Time</div>
        <div className="text-3xl font-bold text-gray-900">{formatDuration(stats.totalTime)}</div>
        <div className="text-xs text-gray-500 mt-1">{stats.sessions} activities</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">Productive Time</div>
        <div className="text-3xl font-bold text-green-600">{formatDuration(stats.productiveTime)}</div>
        <div className="text-xs text-gray-500 mt-1">{productivityPercentage}% of total</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">Productivity Score</div>
        <div className="flex items-baseline">
          <div className="text-3xl font-bold text-primary-600">{productivityPercentage}</div>
          <div className="text-xl text-gray-600 ml-1">%</div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${productivityPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
