import { Box, Container, Typography, AppBar, Toolbar, Link, Stack } from '@mui/material';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useMQTT } from '../contexts/MQTTContext';

// Dynamically import components with client-side only rendering
const ConnectionForm = dynamic(() => import('../components/ConnectionForm'), { ssr: false });
const TopicSubscriber = dynamic(() => import('../components/TopicSubscriber'), { ssr: false });
const MessagePublisher = dynamic(() => import('../components/MessagePublisher'), { ssr: false });
const MessageViewer = dynamic(() => import('../components/MessageViewer'), { ssr: false });

export default function Home() {
  const { isConnected, subscribe } = useMQTT();

  // Auto-subscribe to ThatsApp topics when connected
  useEffect(() => {
    if (isConnected) {
      subscribe('thatsapp/publictest/#');
    }
  }, [isConnected, subscribe]);

  return (
    <>
      <Head>
        <title>ThatsApp MQTT Debugger</title>
        <meta name="description" content="Debug MQTT messages for ThatsApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ThatsApp MQTT Debugger
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Container maxWidth="xl" sx={{ height: '100%', py: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 2, 
              height: '100%'
            }}>
              <Box sx={{ flex: 1, maxWidth: { md: '450px' } }}>
                <Stack spacing={2}>
                  <ConnectionForm />
                  <TopicSubscriber />
                  <MessagePublisher />
                </Stack>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <MessageViewer />
              </Box>
            </Box>
          </Container>
        </Box>

        <Box 
          component="footer" 
          sx={{ 
            py: 1, 
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {'Made with ❤️ by Doruk for FHNW EMOBA module'}
          </Typography>
        </Box>
      </Box>
    </>
  );
}