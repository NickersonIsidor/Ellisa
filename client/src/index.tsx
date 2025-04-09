import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { io } from 'socket.io-client';
import FakeStackOverflow from './components/fakestackoverflow';
import { FakeSOSocket, SafeDatabaseUser } from './types/types';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LoginContext from './contexts/LoginContext';

const container = document.getElementById('root');

const App = () => {
  const [socket, setSocket] = useState<FakeSOSocket | null>(null);
  const [user, setUser] = useState<SafeDatabaseUser | null>(null);
  const { setIsDarkMode, setIsHighContrast } = useTheme();
  const serverURL = process.env.REACT_APP_SERVER_URL;

  if (!serverURL) {
    throw new Error("Environment variable 'REACT_APP_SERVER_URL' must be defined");
  }

  useEffect(() => {
    if (!socket) {
      setSocket(io(serverURL));
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket, serverURL]);

  useEffect(() => {
    // When component mounts, check if there's a user and apply their preferences
    if (user) {
      console.log('📱 Initializing theme from user preferences:', {
        username: user.username,
        darkMode: user.darkMode,
        highContrast: user.highContrast,
      });
      setIsDarkMode(user.darkMode ?? false);
      setIsHighContrast(user.highContrast ?? false);
    }
  }, [user, setIsDarkMode, setIsHighContrast]);

  const handleUserLogin = (userData: SafeDatabaseUser | null) => {
    console.log(
      '🚪 App - User login state changed:',
      userData
        ? {
            username: userData.username,
            darkMode: userData.darkMode,
            highContrast: userData.highContrast,
          }
        : 'Logged out',
    );

    setUser(userData);
    if (userData) {
      console.log('🎨 App - Setting theme from user preferences');
      setIsDarkMode(userData.darkMode ?? false);
      setIsHighContrast(userData.highContrast ?? false);
    } else {
      console.log('🎨 App - Resetting theme to defaults');
      setIsDarkMode(false);
      setIsHighContrast(false);
    }
  };

  return (
    <Router>
      <LoginContext.Provider value={{ setUser: handleUserLogin, user }}>
        <FakeStackOverflow socket={socket} />
      </LoginContext.Provider>
    </Router>
  );
};

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
