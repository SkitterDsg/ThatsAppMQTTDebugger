import { Box, Container, Typography, AppBar, Toolbar, Link, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useMQTT } from '../contexts/MQTTContext';

// Dynamically import components with client-side only rendering
const ConnectionForm = dynamic(() => import('../components/ConnectionForm'), { ssr: false });
const TopicSubscriber = dynamic(() => import('../components/TopicSubscriber'), { ssr: false });
const MessagePublisher = dynamic(() => import('../components/MessagePublisher'), { ssr: false });
const MessageViewer = dynamic(() => import('../components/MessageViewer'), { ssr: false });
const MessageTypesGuide = dynamic(() => import('../components/MessageTypesGuide'), { ssr: false });

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
        <link rel="icon" href="/thatsapp.png" />
      </Head>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={1} sx={{ 
          background: 'rgba(30, 30, 36, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ 
              px: { xs: 1, sm: 2 }, 
              py: 1, 
              borderRadius: { md: '0 0 12px 12px' }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                flexGrow: 1 
              }}>
                <img 
                  src="/thatsapp.png" 
                  alt="ThatsApp Logo" 
                  width="28" 
                  height="28" 
                  style={{ borderRadius: '6px' }}
                />
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  ThatsApp MQTT Debugger
                </Typography>
              </Box>
              <MessageTypesGuide />
            </Toolbar>
          </Container>
        </AppBar>

        <Box sx={{ flexGrow: 1, overflow: 'visible' }}>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 3
            }}>
              <Box sx={{ 
                flex: 1, 
                maxWidth: { md: '450px' },
                transition: 'all 0.3s ease'
              }}>
                <Stack 
                  spacing={3} 
                  component={motion.div}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {},
                  }}
                >
                  <ConnectionForm />
                  <TopicSubscriber />
                  <MessagePublisher />
                </Stack>
              </Box>
              <Box sx={{ 
                flex: 1.5, 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease' 
              }}>
                <MessageViewer />
              </Box>
            </Box>
          </Container>
        </Box>

        <Box 
          component="footer" 
          sx={{ 
            py: 1.5, 
            mt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(30, 30, 36, 0.8)'
          }}
        >
          <Container maxWidth="xl">
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={{ xs: 1, sm: 2 }} 
              justifyContent="center" 
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary" align="center">
                {'Made with ❤️ by Doruk for FHNW EMOBA module'}
              </Typography>
              <Box 
                sx={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  display: { xs: 'none', sm: 'block' }
                }} 
              />
              <Link 
                href="https://github.com/peaktwilight/ThatsAppMQTTDebugger" 
                target="_blank" 
                rel="noopener noreferrer" 
                color="primary"
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Repository
              </Link>
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
}