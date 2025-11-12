import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { ActivityStats } from './ActivityStats';
import { ActivityTimeline } from './ActivityTimeline';
import { TopApps } from './TopApps';

interface DashboardProps {
  supabase: SupabaseClient;
  session: any;
}

export function Dashboard({ supabase, session }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'settings'>('today');
  const [trackingPaused, setTrackingPaused] = useState(false);

  useEffect(() => {
    // Check if tracking is paused
    window.electron?.isTrackingPaused().then(setTrackingPaused);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleTracking = async () => {
    if (trackingPaused) {
      await window.electron?.resumeTracking();
      setTrackingPaused(false);
    } else {
      await window.electron?.pauseTracking();
      setTrackingPaused(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TrackMe</h1>
            <p className="text-sm text-gray-600">
              {session?.user?.email}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  trackingPaused ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
              <span className="text-sm text-gray-700">
                {trackingPaused ? 'Paused' : 'Tracking'}
              </span>
            </div>

            <button
              onClick={toggleTracking}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                trackingPaused
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {trackingPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'today'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'week'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === 'today' && (
          <div className="space-y-6">
            <ActivityStats supabase={supabase} userId={session.user.id} period="today" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopApps supabase={supabase} userId={session.user.id} period="today" />
              <ActivityTimeline supabase={supabase} userId={session.user.id} period="today" />
            </div>
          </div>
        )}

        {activeTab === 'week' && (
          <div className="space-y-6">
            <ActivityStats supabase={supabase} userId={session.user.id} period="week" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopApps supabase={supabase} userId={session.user.id} period="week" />
              <ActivityTimeline supabase={supabase} userId={session.user.id} period="week" />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Check-In Settings</h3>
                  <p className="text-sm text-gray-600">
                    Configure when and how you want to be prompted for manual check-ins.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Privacy</h3>
                  <p className="text-sm text-gray-600">
                    Control what information is tracked and stored.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                  <p className="text-sm text-gray-600">
                    TrackMe v1.0.0 - Automated Time Tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
