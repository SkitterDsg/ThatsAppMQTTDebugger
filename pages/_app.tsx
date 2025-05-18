import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import '../styles/globals.css';
import theme from '../styles/theme';

// Import MQTTProvider only on client-side
const ClientSideMQTTProvider = dynamic(
  () => import('../contexts/MQTTContext').then(mod => ({ default: mod.MQTTProvider })),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
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