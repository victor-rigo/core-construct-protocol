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

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('profile_data, has_completed_onboarding')
          .eq('id', userId)
          .single();

        if (data && isMounted) {
          if (data.profile_data) {
            setProfile(data.profile_data as any);
          }
          setHasCompletedOnboarding(data.has_completed_onboarding ?? false);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    // Set up listener BEFORE getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await loadProfile(newSession.user.id);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setProfile, setHasCompletedOnboarding]);

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
