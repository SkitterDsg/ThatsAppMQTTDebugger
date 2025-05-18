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
        {!isConnected ? (
          <Button variant="contained" color="primary" onClick={handleConnect}>
            Connect
          </Button>
        ) : (
          <Button variant="contained" color="error" onClick={disconnect}>
            Disconnect
          </Button>
        )}
        <Typography 
          variant="body2" 
          sx={{ mt: 1, color: isConnected ? 'success.main' : 'error.main' }}
        >
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </Typography>
      </Box>
    </Paper>
  );
}