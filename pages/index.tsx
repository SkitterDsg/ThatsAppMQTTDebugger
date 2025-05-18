import { Box, Container, Typography, AppBar, Toolbar, Link, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useMQTT } from '../contexts/MQTTContext';

// Dynamically import components with client-side only rendering
const ConnectionForm = dynamic(() => import('../components/ConnectionForm'), { ssr: false });
const TopicSubscriber = dynamic(() => import('../components/TopicSubscriber'), { ssr: false });
const MessagePublisher = dynamic(() => import('../components/MessagePublisher'), { ssr: false });
const MessageViewer = dynamic(() => import('../components/MessageViewer'), { ssr: false });
const MessageTypesGuide = dynamic(() => import('../components/MessageTypesGuide'), { ssr: false });

export default function Home() {
  const { isConnected, subscribe } = useMQTT();
  const [hasInitialSubscribed, setHasInitialSubscribed] = useState(false);
  const [showConnectGuide, setShowConnectGuide] = useState(true);

  // Hide the connect guide immediately when connected
  useEffect(() => {
    if (isConnected) {
      // Set to false immediately - don't wait for animation
      setShowConnectGuide(false);
    }
  }, [isConnected]);

  // Auto-subscribe to default topic only on first connection
  useEffect(() => {
    if (isConnected && !hasInitialSubscribed) {
      subscribe('thatsapp/publictest/#');
      setHasInitialSubscribed(true);
    }
  }, [isConnected, subscribe, hasInitialSubscribed]);

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
          background: 'linear-gradient(135deg, rgba(25, 28, 45, 0.85) 0%, rgba(20, 22, 33, 0.95) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07), 0 2px 10px rgba(0, 0, 0, 0.2)'
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
                <Box sx={{ width: 28, height: 28, position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                  <Image 
                    src="/thatsapp.png" 
                    alt="ThatsApp Logo" 
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
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
                <Box sx={{ position: 'relative' }}>
                  <Stack 
                    spacing={3} 
                    component={motion.div}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {},
                    }}
                    position="relative"
                  >
                    <Box position="relative">
                      <ConnectionForm />
                      
                      <AnimatePresence mode="wait">
                        {showConnectGuide && (
                          <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              scale: 1,
                              transition: { 
                                delay: 0.5, 
                                duration: 0.5,
                                type: "spring",
                                stiffness: 300,
                                damping: 24
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              scale: 0.8,
                              transition: { 
                                duration: 0.2,
                                ease: "easeOut"
                              }
                            }}
                            sx={{
                              position: 'absolute',
                              bottom: '-90px', // Position between ConnectionForm and TopicSubscriber with extra space
                              left: '40px', // Aligned with the Connect button
                              zIndex: 50,
                              width: '100%',
                              maxWidth: 280,
                              textAlign: 'center',
                            }}
                          >
                            <motion.div
                              animate={{ 
                                y: [0, 8, 0],
                              }}
                              transition={{ 
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 1.5,
                                ease: "easeInOut"
                              }}
                            >
                              <Box sx={{
                                position: 'relative'
                              }}>
                                <Box sx={{
                                  background: 'linear-gradient(135deg, rgba(57, 73, 171, 0.9) 0%, rgba(48, 63, 159, 0.95) 100%)',
                                  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
                                  borderRadius: 2,
                                  p: 2,
                                  position: 'relative'
                                }}>
                                  <Box 
                                    component={motion.div}
                                    sx={{
                                      fontSize: '24px',
                                      color: 'primary.main',
                                      position: 'absolute',
                                      top: '-40px',
                                      left: '20px'
                                    }}
                                    animate={{ y: [-2, 2, -2] }}
                                    transition={{
                                      repeat: Infinity,
                                      repeatType: "reverse",
                                      duration: 1.5,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    ↑
                                  </Box>
                                  <Typography variant="body2" sx={{ 
                                    fontWeight: 500,
                                    color: 'white'
                                  }}>
                                    Click Connect to begin debugging
                                  </Typography>
                                </Box>
                              </Box>
                            </motion.div>
                          </Box>
                        )}
                      </AnimatePresence>
                    </Box>
                    
                    <TopicSubscriber />
                    <MessagePublisher />
                  </Stack>
                </Box>
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
            background: 'linear-gradient(135deg, rgba(25, 28, 45, 0.85) 0%, rgba(20, 22, 33, 0.95) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 -4px 8px rgba(0, 0, 0, 0.15)'
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