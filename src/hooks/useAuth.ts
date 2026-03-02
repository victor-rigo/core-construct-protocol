import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import type { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProfile, setHasCompletedOnboarding } = useAppStore();

  useEffect(() => {
    // Set up listener BEFORE getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Defer DB call to avoid deadlock
          setTimeout(async () => {
            const { data } = await supabase
              .from('profiles')
              .select('profile_data, has_completed_onboarding')
              .eq('id', newSession.user.id)
              .single();

            if (data) {
              if (data.profile_data) {
                setProfile(data.profile_data as any);
              }
              setHasCompletedOnboarding(data.has_completed_onboarding ?? false);
            }
          }, 0);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setProfile, setHasCompletedOnboarding]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null as any);
    setHasCompletedOnboarding(false);
  };

  return { user, session, loading, signOut };
};
