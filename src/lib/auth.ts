
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
