import React from 'react';

// Declare external modules
declare module 'ms';
declare module 'babel__template';

// Theme State Interface
interface ThemeState {
  isHighContrast: boolean;
  setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  forceApplyHighContrastStyles?: () => void;
}

// Extend the Window interface globally
declare global {
  interface Window {
    __THEME_STATE__?: ThemeState;
  }
}

// Export to make it a module
export {};
