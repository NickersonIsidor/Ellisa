// client/src/contexts/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from 'react';

export interface ThemeContextType {
  isHighContrast: boolean;
  setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  applyUserPreferences: (darkMode: boolean, highContrast: boolean) => void; // New function
}

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial values from localStorage with fallback to defaults
  const [isHighContrast, setIsHighContrast] = useState(() => {
    const saved = localStorage.getItem('highContrast');
    return saved ? saved === 'true' : false;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? saved === 'true' : false;
  });

  const applyUserPreferences = useCallback((darkMode: boolean, highContrast: boolean) => {
    setIsDarkMode(darkMode);
    setIsHighContrast(highContrast);
  }, []);

  // Comprehensive dark mode and high contrast application
  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove('dark-mode', 'high-contrast', 'high-contrast-dark');
    document.body.classList.remove('dark-mode', 'high-contrast', 'high-contrast-dark');

    // Apply appropriate classes based on theme state
    if (isDarkMode && isHighContrast) {
      document.documentElement.classList.add('high-contrast-dark');
      document.body.classList.add('high-contrast-dark');
    } else if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    }

    // Persist theme preferences in localStorage as backup
    localStorage.setItem('darkMode', isDarkMode.toString());
    localStorage.setItem('highContrast', isHighContrast.toString());

    // Make theme state available globally
    const themeState = {
      isHighContrast,
      setIsHighContrast,
      isDarkMode,
      setIsDarkMode,
      applyUserPreferences,
      forceApplyHighContrastStyles: () => {
        document.documentElement.classList.add('high-contrast-dark');
        document.body.classList.add('high-contrast-dark');
      },
    };

    // Use type assertion to handle window property
    (window as Window & { __THEME_STATE__?: typeof themeState }).__THEME_STATE__ = themeState;
  }, [isDarkMode, isHighContrast, applyUserPreferences]);

  return (
    <ThemeContext.Provider
      value={{
        isHighContrast,
        setIsHighContrast,
        isDarkMode,
        setIsDarkMode,
        applyUserPreferences,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
