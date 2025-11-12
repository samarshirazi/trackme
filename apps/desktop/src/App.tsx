import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { CheckInPrompt } from './components/CheckInPrompt';
import { CheckInPromptData } from '@trackme/shared';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkInPrompt, setCheckInPrompt] = useState<CheckInPromptData | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Save user ID to Electron store
      if (session?.user) {
        window.electron?.setUserId(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        window.electron?.setUserId(session.user.id);
      } else {
        window.electron?.clearUserId();
      }
    });

    // Listen for check-in prompts from Electron
    if (window.electron) {
      window.electron.onCheckInPrompt((data: CheckInPromptData) => {
        setCheckInPrompt(data);
      });
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCheckInSubmit = async (data: any) => {
    try {
      await window.electron?.submitCheckIn(data);
      setCheckInPrompt(null);
    } catch (error) {
      console.error('Failed to submit check-in:', error);
    }
  };

  const handleCheckInSnooze = () => {
    window.electron?.snoozeCheckIn(30);
    setCheckInPrompt(null);
  };

  const handleCheckInSkip = () => {
    window.electron?.skipCheckIn();
    setCheckInPrompt(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      {!session ? (
        <Login supabase={supabase} />
      ) : (
        <Dashboard supabase={supabase} session={session} />
      )}

      {checkInPrompt && (
        <CheckInPrompt
          data={checkInPrompt}
          onSubmit={handleCheckInSubmit}
          onSnooze={handleCheckInSnooze}
          onSkip={handleCheckInSkip}
        />
      )}
    </div>
  );
}

export default App;
