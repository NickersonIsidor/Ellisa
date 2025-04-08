import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import FakeStackOverflow from './components/fakestackoverflow';
import HighContrastToggle from './components/HighContrastToggle';
import useLoginContext from './hooks/useLoginContext';

// Component that uses the theme context for the controls
const ThemeControls = () => {
  const { isDarkMode, setIsDarkMode, isHighContrast, setIsHighContrast } = useTheme();
  const { user } = useLoginContext();

  // Initialize theme from user preferences when component mounts
  useEffect(() => {
    if (user) {
      setIsDarkMode(user.darkMode ?? false);
      setIsHighContrast(user.highContrast ?? false);
    }
  }, [user, setIsDarkMode, setIsHighContrast]);

  // Handle dark mode toggle with direct styles application
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '15px',
        backgroundColor: isDarkMode ? '#222' : '#fff',
        border: '2px solid',
        borderColor: isDarkMode ? '#444' : '#ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}>
      <h3
        style={{
          margin: '0 0 15px 0',
          color: isDarkMode ? '#fff' : '#000',
        }}>
        Display Settings
      </h3>
      <div style={{ marginBottom: '10px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#000',
          }}>
          Dark Mode
          <input
            type='checkbox'
            checked={isDarkMode}
            onChange={handleDarkModeToggle}
            style={{ marginLeft: '10px', width: '20px', height: '20px' }}
          />
        </label>
      </div>
      <HighContrastToggle
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        isDarkMode={isDarkMode}
      />
      <div
        style={{
          marginTop: '15px',
          padding: '8px',
          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
          borderRadius: '4px',
          fontSize: '14px',
          color: isDarkMode ? '#fff' : '#000',
        }}>
        <div>Current theme: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</div>
        <div>Current mode: {isHighContrast ? 'High Contrast' : 'Normal'}</div>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <Box style={{ padding: '20px' }}>
      <Routes>
        <Route path='/' element={<FakeStackOverflow socket={null} />} />
        {/* Add other routes as needed */}
      </Routes>
      <ThemeControls />
    </Box>
  </ThemeProvider>
);

export default App;
