import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SupabaseClient } from '@supabase/supabase-js';
import { formatDuration } from '@trackme/shared';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
  supabase: SupabaseClient;
  session: any;
}

interface Stats {
  totalTime: number;
  productiveTime: number;
  topApps: Array<{ name: string; duration: number }>;
}

export function DashboardScreen({ navigation, supabase, session }: DashboardScreenProps) {
  const [stats, setStats] = useState<Stats>({
    totalTime: 0,
    productiveTime: 0,
    topApps: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<'today' | 'week'>('today');

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
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

      // Fetch mobile activity sessions
      const { data: sessions } = await supabase
        .from('activity_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('device_type', 'mobile')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', now.toISOString());

      // Fetch manual check-ins
      const { data: checkIns } = await supabase
        .from('manual_checkins')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', now.toISOString());

      let totalTime = 0;
      let productiveTime = 0;
      const appMap = new Map<string, number>();

      // Process sessions
      sessions?.forEach((session) => {
        const duration = session.duration_seconds || 0;
        totalTime += duration;
        if (session.productivity_score && session.productivity_score >= 70) {
          productiveTime += duration;
        }
        appMap.set(session.app_name, (appMap.get(session.app_name) || 0) + duration);
      });

      // Process check-ins
      checkIns?.forEach((checkIn) => {
        const duration = checkIn.duration_minutes * 60;
        totalTime += duration;
        if (checkIn.productivity_score && checkIn.productivity_score >= 70) {
          productiveTime += duration;
        }
      });

      const topApps = Array.from(appMap.entries())
        .map(([name, duration]) => ({ name, duration }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);

      setStats({ totalTime, productiveTime, topApps });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const productivityPercentage =
    stats.totalTime > 0 ? Math.round((stats.productiveTime / stats.totalTime) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TrackMe</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, period === 'today' && styles.periodButtonActive]}
          onPress={() => setPeriod('today')}
        >
          <Text style={[styles.periodButtonText, period === 'today' && styles.periodButtonTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
          onPress={() => setPeriod('week')}
        >
          <Text style={[styles.periodButtonText, period === 'week' && styles.periodButtonTextActive]}>
            This Week
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Time</Text>
            <Text style={styles.statValue}>{formatDuration(stats.totalTime)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Productive</Text>
            <Text style={styles.statValue}>{formatDuration(stats.productiveTime)}</Text>
          </View>
        </View>

        {/* Productivity Score */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Productivity Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{productivityPercentage}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${productivityPercentage}%` }]} />
            </View>
          </View>
        </View>

        {/* Top Apps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Apps</Text>
          {stats.topApps.length === 0 ? (
            <Text style={styles.emptyText}>No activity recorded yet</Text>
          ) : (
            stats.topApps.map((app, index) => (
              <View key={index} style={styles.appItem}>
                <Text style={styles.appName}>{app.name}</Text>
                <Text style={styles.appDuration}>{formatDuration(app.duration)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CheckIn')}
        >
          <Text style={styles.actionButtonText}>✏️ Log Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonSecondary}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.actionButtonSecondaryText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  logoutButton: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  appItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  appDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: 20,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonSecondaryText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
});
