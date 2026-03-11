import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProfile, setHasCompletedOnboarding } = useAppStore();

  const loadProfile = (userId: string) => {
    supabase
      .from('profiles')
      .select('profile_data, has_completed_onboarding')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load profile:', error);
          return;
        }
        if (data) {
          if (data.profile_data) {
            setProfile(data.profile_data as any);
          }
          setHasCompletedOnboarding(data.has_completed_onboarding ?? false);
        }
      });
  };

  useEffect(() => {
    // 1. Restore session first
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        loadProfile(currentSession.user.id);
      }

      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // 2. Listen for subsequent auth changes (fire-and-forget, no await)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          loadProfile(newSession.user.id);
        } else {
          setProfile(null as any);
          setHasCompletedOnboarding(false);
        }

        setLoading(false);
      }
    );

    // 3. Timeout safety net
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null as any);
    setHasCompletedOnboarding(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
