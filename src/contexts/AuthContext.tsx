
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
  handleEmailConfirmation: () => Promise<{ error: any; success?: boolean }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle email confirmation
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          console.log('Email confirmed and user signed in');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    console.log('Attempting to sign up user:', email);
    const redirectUrl = `${window.location.origin}/auth?confirmed=true`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    
    console.log('Sign up result:', { data, error });
    
    if (error) {
      return { error };
    }
    
    // Check if email confirmation is required
    if (data.user && !data.session) {
      return { 
        error: null,
        needsConfirmation: true
      };
    }
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in result:', { data, error });
    
    if (error) {
      // Provide more helpful error messages
      if (error.message.includes('Invalid login credentials')) {
        return { 
          error: { 
            message: "Invalid email or password. If you just signed up, please check your email and confirm your account first." 
          } 
        };
      }
      if (error.message.includes('Email not confirmed')) {
        return { 
          error: { 
            message: "Please check your email and click the confirmation link before signing in. If the link expired, you can request a new one below." 
          } 
        };
      }
      return { error };
    }
    
    return { error: null };
  };

  const resendConfirmation = async (email: string) => {
    console.log('Resending confirmation email to:', email);
    const redirectUrl = `${window.location.origin}/auth?confirmed=true`;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    console.log('Resend confirmation result:', { error });
    return { error };
  };

  const handleEmailConfirmation = async () => {
    console.log('Handling email confirmation from URL');
    
    try {
      // Check if we're handling a confirmation
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Check for error in URL
      const error = urlParams.get('error') || hashParams.get('error');
      const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
      
      if (error) {
        console.log('Confirmation error detected:', error, errorDescription);
        
        if (error === 'access_denied' && errorDescription?.includes('expired')) {
          return { 
            error: { 
              message: "The confirmation link has expired. Please request a new confirmation email below." 
            } 
          };
        }
        
        return { 
          error: { 
            message: errorDescription || "There was an error confirming your email. Please try again." 
          } 
        };
      }
      
      // Check for successful confirmation
      const confirmed = urlParams.get('confirmed');
      if (confirmed === 'true') {
        // Clear the URL parameters
        window.history.replaceState({}, document.title, '/auth');
        return { error: null, success: true };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error handling email confirmation:', error);
      return { 
        error: { 
          message: "There was an error processing your email confirmation." 
        } 
      };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
    handleEmailConfirmation,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
