import { createContext } from 'react';
import { SafeDatabaseUser } from '../types/types';

/**
 * Interface representing the context type for user login management.
 *
 * - setUser - A function to update the current user in the context,
 *             which take User object representing the logged-in user or null
 *             to indicate no user is logged in.
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
