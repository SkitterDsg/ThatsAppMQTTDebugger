import { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Stack, FormHelperText } from '@mui/material';
import { useMQTT } from '../contexts/MQTTContext';
import { motion } from 'framer-motion';

export default function ConnectionForm() {
  const { connect, disconnect, isConnected } = useMQTT();
  const [broker, setBroker] = useState(typeof window !== 'undefined' && window.location.protocol === 'https:' 
    ? 'wss://broker.hivemq.com:8884/mqtt' 
    : 'ws://broker.hivemq.com:8000/mqtt');
  const [clientId, setClientId] = useState(`thatsapp-debugger-${Math.random().toString(16).substring(2, 8)}`);

  const handleConnect = () => {
    connect(broker, {
      clientId,
      clean: true,
    });
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" },
    tap: { scale: 0.98 }
  };

  const statusVariants = {
    disconnected: {
      backgroundColor: "#ef5350",
      boxShadow: "0 0 0 0 rgba(239, 83, 80, 0.4)"
    },
    connected: {
      backgroundColor: "#66bb6a",
      boxShadow: "0 0 0 0 rgba(102, 187, 106, 0.4)"
    },
    pulse: {
      boxShadow: [
        "0 0 0 0 rgba(102, 187, 106, 0.4)",
        "0 0 0 6px rgba(102, 187, 106, 0)",
        "0 0 0 0 rgba(102, 187, 106, 0)"
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        times: [0, 0.7, 1]
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Paper 
        component={motion.div}
        variants={itemVariants}
        sx={{ 
          p: 2, 
          mb: 2, 
          borderRadius: 2,
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}
      >
        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            MQTT Connection
          </Typography>
        </motion.div>
        <Stack 
          component={motion.div}
          variants={itemVariants}
          spacing={2} 
          direction={{ xs: 'column', sm: 'row' }} 
          sx={{ mb: 2 }}
        >
          <Box component={motion.div} sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Broker URL"
              variant="outlined"
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              disabled={isConnected}
              size="small"
              InputProps={{
                sx: {
                  borderRadius: 1.5,
                  transition: "all 0.3s ease"
                }
              }}
            />
            <FormHelperText>
              {window?.location?.protocol === 'https:' ? 
                'Secure pages require WSS connections (wss://)' : 
                'Browser requires WebSocket URLs (ws:// or wss://)'}
            </FormHelperText>
          </Box>
          <Box component={motion.div} sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Client ID"
              variant="outlined"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={isConnected}
              size="small"
              InputProps={{
                sx: {
                  borderRadius: 1.5,
                  transition: "all 0.3s ease"
                }
              }}
            />
          </Box>
        </Stack>
        <Box 
          component={motion.div}
          variants={itemVariants}
          sx={{ mt: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isConnected ? (
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleConnect}
                  sx={{
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600
                  }}
                >
                  Connect
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={disconnect}
                  sx={{
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600
                  }}
                >
                  Disconnect
                </Button>
              </motion.div>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: 2,
              gap: 1
            }}>
              <motion.div 
                animate={isConnected ? ["connected", "pulse"] : "disconnected"}
                variants={statusVariants}
                style={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%',
                }}
              />
              <motion.div
                animate={{ 
                  color: isConnected ? "#66bb6a" : "#ef5350",
                  scale: isConnected ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  scale: { 
                    duration: 0.3, 
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500
                  }}
                >
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}