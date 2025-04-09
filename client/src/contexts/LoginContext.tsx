import { createContext, ReactNode, useEffect, useState } from 'react';
import { SafeDatabaseUser } from '../types/types';
import { useTheme } from './ThemeContext';

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

// eslint-disable-next-line react/prop-types
export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeDatabaseUser | null>(null);
  const { setIsDarkMode, setIsHighContrast } = useTheme();

  // Load theme preferences when user changes
  useEffect(() => {
    if (user) {
      console.log('👤 Applying theme preferences from user:', {
        username: user.username,
        darkMode: user.darkMode,
        highContrast: user.highContrast,
      });

      // Immediately apply user's theme preferences when user data is set
      setIsDarkMode(user.darkMode ?? false);
      setIsHighContrast(user.highContrast ?? false);

      // Also update localStorage for backup
      localStorage.setItem('darkMode', String(user.darkMode ?? false));
      localStorage.setItem('highContrast', String(user.highContrast ?? false));
    }
  }, [user, setIsDarkMode, setIsHighContrast]);

  const value: LoginContextType = {
    setUser,
    user,
  };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export default LoginContext;
