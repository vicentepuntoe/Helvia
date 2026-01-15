import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Infer types from Supabase client to avoid import issues
type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];
type User = NonNullable<Session>['user'];
type AuthError = Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['error'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting to sign up...');
      console.log('Email:', email);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign up error:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
      } else {
        console.log('✅ Sign up successful');
        if (data?.user && !data?.session) {
          console.log('ℹ️ Email confirmation required');
        }
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Unexpected error during sign up:', err);
      return { 
        error: { 
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
          status: 500
        } as any 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting to sign in...');
      console.log('Email:', email);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set');
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Unexpected error during sign in:', err);
      return { 
        error: { 
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
          status: 500
        } as any 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
