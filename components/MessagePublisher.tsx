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
import { motion, AnimatePresence } from 'framer-motion';
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
          publish(topic, message);
        } catch (_) {
          setJsonError('Invalid JSON format');
          return;
        }
      } else {
        publish(topic, message);
      }
    }
  };

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
        delayChildren: 0.3 // Add a delay for the third component
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const templateVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        opacity: { duration: 0.3 },
        height: { type: "spring", stiffness: 300, damping: 30 }
      }
    },
    exit: { 
      opacity: 0,
      height: 0,
      transition: {
        opacity: { duration: 0.2 },
        height: { duration: 0.3 }
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
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
          p: 3, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(28, 32, 50, 0.6) 0%, rgba(18, 20, 30, 0.75) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.25)',
          overflow: "hidden", // Important for animations
          opacity: isConnected ? 1 : 0.7,
          position: 'relative'
        }}
      >
        {!isConnected && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(15, 18, 35, 0.9) 0%, rgba(10, 12, 20, 0.95) 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderRadius: 2,
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)',
                px: 3,
                py: 1,
                borderRadius: 1,
                background: 'linear-gradient(135deg, rgba(30, 34, 65, 0.85) 0%, rgba(25, 28, 50, 0.95) 100%)',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              Connect to MQTT to publish messages
            </Typography>
          </Box>
        )}
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 2,
              color: "primary.main",
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Publish Message
            {isConnected && (
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  ml: 1.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: '10px',
                  bgcolor: 'success.main',
                  color: 'success.contrastText',
                }}
              >
                UNLOCKED
              </Box>
            )}
          </Typography>
        </motion.div>

        <Box sx={{ mb: 2 }}>
          <motion.div variants={itemVariants}>
            <TextField
              fullWidth
              label="Topic"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={!isConnected}
              size="small"
              sx={{ 
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s ease"
                }
              }}
            />
          </motion.div>
          
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isJsonMessage}
                  onChange={(e) => setIsJsonMessage(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.85rem', ml: 0.5 }}>
                  Format as JSON
                </Typography>
              }
              sx={{ my: 0 }}
            />
          </Box>

          <AnimatePresence>
            {isJsonMessage && (
              <motion.div
                key="json-template-controls"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={templateVariants}
              >
                <Box sx={{ mb: 3, mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 0, mb: 2 }}>
                    ThatsApp Message Templates
                  </Typography>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Sender ID"
                      size="small"
                      value={senderId}
                      onChange={(e) => setSenderId(e.target.value)}
                      InputProps={{
                        sx: {
                          borderRadius: 1.5,
                          transition: "all 0.3s ease"
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Recipient ID"
                      size="small"
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      InputProps={{
                        sx: {
                          borderRadius: 1.5,
                          transition: "all 0.3s ease"
                        }
                      }}
                    />
                  </Stack>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
                    <FormControl size="small" sx={{ width: { xs: '100%', sm: '60%' } }}>
                      <InputLabel>Message Type</InputLabel>
                      <Select
                        value={messageType}
                        label="Message Type"
                        onChange={(e) => setMessageType(e.target.value)}
                        sx={{ 
                          borderRadius: 1.5,
                          transition: "all 0.3s ease"
                        }}
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
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      style={{ width: '40%', flexGrow: 1 }}
                    >
                      <Button 
                        fullWidth
                        variant="outlined"
                        onClick={createTemplateMessage}
                        sx={{ 
                          borderRadius: 1.5,
                          height: "100%",
                          fontWeight: 500,
                          whiteSpace: "nowrap"
                        }}
                      >
                        Create Template
                      </Button>
                    </motion.div>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div variants={itemVariants}>
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
                  } catch (_) {
                    setJsonError('Invalid JSON format');
                  }
                }
              }}
              disabled={!isConnected}
              multiline
              rows={8}
              error={!!jsonError}
              helperText={jsonError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  fontSize: "0.9rem",
                  fontFamily: '"JetBrains Mono", monospace'
                }
              }}
            />
          </motion.div>
        </Box>

        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          initial="idle"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handlePublish}
            disabled={!isConnected || !topic.trim() || !message.trim() || !!jsonError}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none"
            }}
          >
            Publish
          </Button>
        </motion.div>
      </Paper>
    </motion.div>
  );
}