import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { io } from 'socket.io-client';
import FakeStackOverflow from './components/fakestackoverflow';
import { FakeSOSocket } from './types/types';
import { ThemeProvider } from './contexts/ThemeContext'; // ✅ Import your ThemeProvider

const container = document.getElementById('root');

const App = () => {
  const [socket, setSocket] = useState<FakeSOSocket | null>(null);
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

  return (
    <Router>
      <FakeStackOverflow socket={socket} />
    </Router>
  );
};

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        {' '}
        {/* Wrap ChakraProvider with ThemeProvider */}
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
