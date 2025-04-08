// client/src/hooks/useThemeManagement.ts
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import useUserContext from './useUserContext';
import api from '../services/config';

const useThemeManagement = () => {
  const { isDarkMode, setIsDarkMode, isHighContrast, setIsHighContrast } = useTheme();
  const { user } = useUserContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateThemePreferences = async (
    newDarkMode: boolean = isDarkMode,
    newHighContrast: boolean = isHighContrast,
  ) => {
    if (!user) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      await api.patch('/user/updatePreferences', {
        username: user.username,
        darkMode: newDarkMode,
        highContrast: newHighContrast,
      });

      setIsDarkMode(newDarkMode);
      setIsHighContrast(newHighContrast);

      // Supplement with localStorage backup
      localStorage.setItem('darkMode', newDarkMode.toString());
      localStorage.setItem('highContrast', newHighContrast.toString());

      setSuccess('Theme preferences updated successfully');
    } catch (err) {
      setError('Failed to update theme preferences');
      console.error('Theme update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isDarkMode,
    isHighContrast,
    isUpdating,
    error,
    success,
    updateThemePreferences,
  };
};

export default useThemeManagement;
