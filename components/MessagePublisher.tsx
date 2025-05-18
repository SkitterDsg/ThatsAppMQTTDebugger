import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Divider
} from '@mui/material';
import { useMQTT } from '../contexts/MQTTContext';
import {
  ThatsAppMessage,
  createTextMessage,
  createImageMessage,
  createLocationMessage,
  createProfileUpdateMessage,
  createRequestProfileMessage,
  createTypingMessage,
  createOnlinePollMessage,
  createOnlineResponseMessage
} from '../lib/messageTemplates';

export default function MessagePublisher() {
  const { publish, isConnected } = useMQTT();
  const [topic, setTopic] = useState('thatsapp/publictest/recipient/messages');
  const [message, setMessage] = useState('');
  const [isJsonMessage, setIsJsonMessage] = useState(true);
  const [jsonError, setJsonError] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [senderId, setSenderId] = useState('debugger');
  const [recipientId, setRecipientId] = useState('recipient');
  const [retained, setRetained] = useState(false);

  const createTemplateMessage = () => {
    let templateMessage: ThatsAppMessage;

    switch (messageType) {
      case 'text':
        templateMessage = createTextMessage(senderId, recipientId, 'Hello from MQTT Debugger');
        break;
      case 'image':
        templateMessage = createImageMessage(senderId, recipientId, 'https://picsum.photos/200/300');
        break;
      case 'location':
        templateMessage = createLocationMessage(senderId, recipientId, 47.3769, 8.5417); // Zurich coordinates
        break;
      case 'profile_update':
        templateMessage = createProfileUpdateMessage(senderId, recipientId, 'Debug User', 'https://ui-avatars.com/api/?name=Debug+User');
        break;
      case 'request_profile':
        templateMessage = createRequestProfileMessage(senderId, recipientId);
        break;
      case 'typing':
        templateMessage = createTypingMessage(senderId, recipientId);
        break;
      case 'online_poll':
        templateMessage = createOnlinePollMessage(senderId, 'Debug User', 'https://ui-avatars.com/api/?name=Debug+User');
        break;
      case 'online_response':
        templateMessage = createOnlineResponseMessage(senderId, 'Debug User', 'https://ui-avatars.com/api/?name=Debug+User');
        break;
      default:
        templateMessage = createTextMessage(senderId, recipientId, 'Hello from MQTT Debugger');
    }

    if (messageType === 'online_poll' || messageType === 'online_response') {
      setTopic('thatsapp/publictest/global');
    } else {
      setTopic(`thatsapp/publictest/${recipientId}/messages`);
    }

    setMessage(JSON.stringify(templateMessage, null, 2));
  };

  const handlePublish = () => {
    if (topic.trim() && message.trim()) {
      if (isJsonMessage) {
        try {
          // Validate JSON
          JSON.parse(message);
          setJsonError('');
          publish(topic, message, retained);
        } catch (err) {
          setJsonError('Invalid JSON format');
          return;
        }
      } else {
        publish(topic, message, retained);
      }
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Publish Message
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Topic"
          variant="outlined"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={!isConnected}
          size="small"
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={isJsonMessage}
                  onChange={(e) => setIsJsonMessage(e.target.checked)}
                  color="primary"
                />
              }
              label="Format as JSON"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={retained}
                  onChange={(e) => setRetained(e.target.checked)}
                  color="warning"
                />
              }
              label="Retained"
            />
          </Stack>
        </Box>

        {isJsonMessage && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ThatsApp Message Templates
            </Typography>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Sender ID"
                size="small"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
              />
              <TextField
                fullWidth
                label="Recipient ID"
                size="small"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
              />
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Message Type</InputLabel>
                <Select
                  value={messageType}
                  label="Message Type"
                  onChange={(e) => setMessageType(e.target.value)}
                >
                  <MenuItem value="text">TEXT</MenuItem>
                  <MenuItem value="image">IMAGE</MenuItem>
                  <MenuItem value="location">LOCATION</MenuItem>
                  <MenuItem value="profile_update">PROFILE_UPDATE</MenuItem>
                  <MenuItem value="request_profile">REQUEST_PROFILE</MenuItem>
                  <MenuItem value="typing">TYPING</MenuItem>
                  <MenuItem value="online_poll">ONLINE_POLL</MenuItem>
                  <MenuItem value="online_response">ONLINE_RESPONSE</MenuItem>
                </Select>
              </FormControl>
              <Button 
                fullWidth
                variant="outlined"
                onClick={createTemplateMessage}
              >
                Create Template
              </Button>
            </Stack>
            <Divider sx={{ mb: 2 }} />
          </Box>
        )}
        
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (isJsonMessage) {
              try {
                JSON.parse(e.target.value);
                setJsonError('');
              } catch (err) {
                setJsonError('Invalid JSON format');
              }
            }
          }}
          disabled={!isConnected}
          multiline
          rows={8}
          error={!!jsonError}
          helperText={jsonError}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePublish}
        disabled={!isConnected || !topic.trim() || !message.trim() || !!jsonError}
      >
        Publish
      </Button>
    </Paper>
  );
}