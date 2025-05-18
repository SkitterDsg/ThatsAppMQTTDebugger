import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import '../styles/globals.css';

// Import MQTTProvider only on client-side
const ClientSideMQTTProvider = dynamic(
  () => import('../contexts/MQTTContext').then(mod => ({ default: mod.MQTTProvider })),
  { ssr: false }
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {isMounted ? (
        <ClientSideMQTTProvider>
          <Component {...pageProps} />
        </ClientSideMQTTProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}