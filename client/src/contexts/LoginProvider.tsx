// client/src/contexts/LoginProvider.tsx
import React, { useState, useEffect } from 'react';
import LoginContext, { LoginContextType } from './LoginContext';
import { SafeDatabaseUser } from '../types/types';
import { useTheme } from './ThemeContext';

const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeDatabaseUser | null>(null);
  const { setIsDarkMode, setIsHighContrast } = useTheme();

  useEffect(() => {
    console.log(
      '👤 LoginProvider - User changed:',
      user
        ? {
            username: user.username,
            darkMode: user.darkMode,
            highContrast: user.highContrast,
          }
        : 'No user',
    );

    if (user) {
      console.log('🎨 Applying user theme preferences:', {
        darkMode: user.darkMode ?? false,
        highContrast: user.highContrast ?? false,
      });

      setIsDarkMode(user.darkMode ?? false);
      setIsHighContrast(user.highContrast ?? false);

      // Also ensure preferences are saved to localStorage
      // localStorage.setItem('darkMode', String(user.darkMode ?? false));
      // localStorage.setItem('highContrast', String(user.highContrast ?? false));

      // console.log('💾 Saved preferences to localStorage');
    }
  }, [user, setIsDarkMode, setIsHighContrast]);

  const value: LoginContextType = {
    setUser,
    user,
  };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export default LoginProvider;
