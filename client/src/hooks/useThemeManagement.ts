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
    if (!user) {
      console.warn('⚠️ Cannot update theme preferences - no user logged in');
      return;
    }

    console.log('🔄 Updating theme preferences:', {
      username: user.username,
      currentSettings: { darkMode: isDarkMode, highContrast: isHighContrast },
      newSettings: { darkMode: newDarkMode, highContrast: newHighContrast },
    });

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      // Send the update to the server, similar to how biography is updated
      const response = await api.patch(
        `${process.env.REACT_APP_SERVER_URL}/user/updatePreferences`,
        {
          username: user.username,
          darkMode: newDarkMode,
          highContrast: newHighContrast,
        },
      );

      console.log('✅ Server response for theme update:', response.data);

      //   if (response.data && response.status === 200) {
      //     console.log('👤 Updating user context with new preferences');
      //     setUser(response.data);
      //   }

      setIsDarkMode(newDarkMode);
      setIsHighContrast(newHighContrast);

      // Supplement with localStorage backup
      localStorage.setItem('darkMode', newDarkMode.toString());
      localStorage.setItem('highContrast', newHighContrast.toString());

      setSuccess('Theme preferences updated successfully');
    } catch (err) {
      console.error('❌ Theme update error:', err);
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
