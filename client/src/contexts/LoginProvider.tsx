import React, { useState, useEffect } from 'react';
import LoginContext, { LoginContextType } from './LoginContext';
import { SafeDatabaseUser } from '../types/types';

const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeDatabaseUser | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    if (user) {
      setIsDarkMode(user.darkMode ?? false);
      setIsHighContrast(user.highContrast ?? false);
    } else {
      setIsDarkMode(false);
      setIsHighContrast(false);
    }
  }, [user, setIsDarkMode, setIsHighContrast]);

  const value: LoginContextType = {
    setUser,
    user,
    isDarkMode: user?.darkMode ?? false,
    setIsDarkMode,
    isHighContrast: user?.highContrast ?? false,
    setIsHighContrast,
  };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export default LoginProvider;
