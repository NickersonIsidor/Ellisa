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

  const handleUserLogin = (userData: SafeDatabaseUser | null) => {
    setUser(userData);
    if (userData) {
      setIsDarkMode(userData.darkMode ?? false);
      setIsHighContrast(userData.highContrast ?? false);
    } else {
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