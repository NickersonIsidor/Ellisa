// client/src/contexts/LoginProvider.tsx
import React, { useState, useEffect } from 'react';
import LoginContext, { LoginContextType } from './LoginContext';
import { SafeDatabaseUser } from '../types/types';
import { useTheme } from './ThemeContext';

const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeDatabaseUser | null>(null);
  const { setIsDarkMode, setIsHighContrast } = useTheme();

  // Load theme preferences when user changes
  useEffect(() => {
    if (user) {
      // Apply user's theme preferences when they log in
      setIsDarkMode(user.darkMode ?? false);
      setIsHighContrast(user.highContrast ?? false);
    }
  }, [user, setIsDarkMode, setIsHighContrast]);

  const value: LoginContextType = {
    setUser,
    user,
  };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export default LoginProvider;
