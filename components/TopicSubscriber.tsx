import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Chip, 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem 
} from '@mui/material';
import { useMQTT } from '../contexts/MQTTContext';

export default function TopicSubscriber() {
  const { subscribe, unsubscribe, subscribedTopics, isConnected } = useMQTT();
  const [topic, setTopic] = useState('thatsapp/publictest/#');

  const handleSubscribe = () => {
    if (topic.trim()) {
      subscribe(topic.trim());
      setTopic('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Topic Subscriptions
      </Typography>
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          label="Topic to Subscribe"
          variant="outlined"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          placeholder="e.g., thatsapp/publictest/#"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubscribe}
          disabled={!isConnected || !topic.trim()}
        >
          Subscribe
        </Button>
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Subscribed Topics:
      </Typography>
      
      {subscribedTopics.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No topics subscribed yet.
        </Typography>
      ) : (
        <List dense>
          {subscribedTopics.map((t) => (
            <ListItem key={t} disablePadding sx={{ py: 0.5 }}>
              <Chip
                label={t}
                onDelete={() => unsubscribe(t)}
                color="primary"
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}