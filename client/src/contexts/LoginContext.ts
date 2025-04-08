// client/src/contexts/LoginContext.ts
import { createContext } from 'react';
import { SafeDatabaseUser } from '../types/types';

/**
 * Interface representing the context type for user login management.
 */
export interface LoginContextType {
  setUser: (user: SafeDatabaseUser | null) => void;
  user?: SafeDatabaseUser | null;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  isHighContrast?: boolean;
  setIsHighContrast?: (val: boolean) => void;
}

const LoginContext = createContext<LoginContextType | null>(null);

export default LoginContext;
