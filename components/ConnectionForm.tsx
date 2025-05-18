import { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Stack, FormHelperText } from '@mui/material';
import { useMQTT } from '../contexts/MQTTContext';

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

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        MQTT Connection
      </Typography>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Broker URL"
            variant="outlined"
            value={broker}
            onChange={(e) => setBroker(e.target.value)}
            disabled={isConnected}
            size="small"
          />
          <FormHelperText>
            {window?.location?.protocol === 'https:' ? 
              'Secure pages require WSS connections (wss://)' : 
              'Browser requires WebSocket URLs (ws:// or wss://)'}
          </FormHelperText>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Client ID"
            variant="outlined"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            disabled={isConnected}
            size="small"
          />
        </Box>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isConnected ? (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleConnect}
              sx={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                px: 3
              }}
            >
              Connect
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="error" 
              onClick={disconnect}
              sx={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                px: 3
              }}
            >
              Disconnect
            </Button>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            ml: 2,
            gap: 1
          }}>
            <Box 
              sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: isConnected ? 'success.main' : 'error.main',
                boxShadow: isConnected 
                  ? '0 0 0 4px rgba(102, 187, 106, 0.1)' 
                  : '0 0 0 4px rgba(239, 83, 80, 0.1)',
                animation: isConnected 
                  ? 'pulse 1.5s infinite' 
                  : 'none',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(102, 187, 106, 0.4)'
                  },
                  '70%': {
                    boxShadow: '0 0 0 6px rgba(102, 187, 106, 0)'
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(102, 187, 106, 0)'
                  }
                }
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: isConnected ? 'success.main' : 'error.main',
                fontWeight: 500
              }}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}