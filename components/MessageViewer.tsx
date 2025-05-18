import { useEffect, useState, useMemo } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  Divider, 
  Button,
  Chip,
  TextField,
  IconButton,
  Collapse,
  FormControlLabel,
  Switch,
  Tooltip,
  Avatar
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useMQTT } from '../contexts/MQTTContext';

// Component to display formatted message content based on message type
const MessageContent = ({ message }: { message: string }) => {
  const [showRawJson, setShowRawJson] = useState(false);
  
  try {
    const parsed = JSON.parse(message);
    
    // Raw JSON view toggle for all message types
    if (showRawJson) {
      return (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button 
              size="small" 
              variant="text" 
              onClick={() => setShowRawJson(false)}
              sx={{ fontSize: '0.75rem' }}
            >
              Show Formatted View
            </Button>
          </Box>
          <Box 
            component="pre" 
            sx={{ 
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              p: 1,
              borderRadius: 1
            }}
          >
            {JSON.stringify(parsed, null, 2)}
          </Box>
        </>
      );
    }
    
    if (!parsed.type) {
      // Not a ThatsApp message, just show formatted JSON with a toggle option
      return (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>
              Generic JSON Message
            </Typography>
          </Box>
          <Box 
            component="pre" 
            sx={{ 
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0
            }}
          >
            {JSON.stringify(parsed, null, 2)}
          </Box>
        </>
      );
    }

    // Common message metadata display
    const MessageMeta = () => (
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ opacity: 0.7 }}>
          <Typography variant="caption" sx={{ mr: 2 }}>
            <strong>From:</strong> {parsed.senderId}
          </Typography>
          {parsed.recipientId && (
            <Typography variant="caption" sx={{ mr: 2 }}>
              <strong>To:</strong> {parsed.recipientId}
            </Typography>
          )}
          <Typography variant="caption">
            <strong>Time:</strong> {new Date(parsed.timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Button 
          size="small" 
          variant="text" 
          onClick={() => setShowRawJson(true)}
          sx={{ fontSize: '0.75rem', ml: 1 }}
        >
          View Raw JSON
        </Button>
      </Box>
    );

    // Render based on message type
    switch (parsed.type.toString().toUpperCase()) {
      case 'TEXT':
        return (
          <Box>
            <MessageMeta />
            <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
              <Typography>{parsed.payload}</Typography>
            </Box>
          </Box>
        );
        
      case 'IMAGE':
        return (
          <Box>
            <MessageMeta />
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={parsed.payload}
                alt="Image message"
                sx={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px',
                  borderRadius: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.1)'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Error+loading+image';
                }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {parsed.payload}
              </Typography>
            </Box>
          </Box>
        );
        
      case 'LOCATION':
        let locationData = parsed.payload;
        try {
          if (typeof parsed.payload === 'string') {
            locationData = JSON.parse(parsed.payload);
          }
        } catch (_) {
          // Use as is if not JSON
        }
        
        return (
          <Box>
            <MessageMeta />
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
                <Chip 
                  label={`Latitude: ${locationData.latitude || 'N/A'}`} 
                  size="small" 
                  color="info"
                />
                <Chip 
                  label={`Longitude: ${locationData.longitude || 'N/A'}`} 
                  size="small" 
                  color="info" 
                />
              </Box>
              <Typography variant="caption">
                {typeof parsed.payload === 'string' ? parsed.payload : JSON.stringify(parsed.payload)}
              </Typography>
            </Box>
          </Box>
        );
        
      case 'PROFILE_UPDATE':
        let profileData = parsed.payload;
        try {
          if (typeof parsed.payload === 'string') {
            profileData = JSON.parse(parsed.payload);
          }
        } catch (_) {
          // Use as is if not JSON
        }
        
        return (
          <Box>
            <MessageMeta />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {profileData.avatarUrl && (
                <Avatar 
                  src={profileData.avatarUrl} 
                  alt={profileData.name || 'Profile'}
                  sx={{ width: 56, height: 56 }}
                />
              )}
              <Box>
                <Typography variant="subtitle1">{profileData.name || 'Unknown'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Profile updated
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      
      case 'TYPING':
        return (
          <Box>
            <MessageMeta />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyboardIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                {parsed.senderId} is typing...
              </Typography>
            </Box>
          </Box>
        );
        
      case 'ONLINE_POLL':
      case 'ONLINE_RESPONSE':
        let onlineData = parsed.payload;
        try {
          if (typeof parsed.payload === 'string') {
            onlineData = JSON.parse(parsed.payload);
          }
        } catch (_) {
          // Use as is if not JSON
        }
        
        return (
          <Box>
            <MessageMeta />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {onlineData.avatarUrl && (
                <Avatar 
                  src={onlineData.avatarUrl} 
                  alt={onlineData.name || parsed.senderId}
                  sx={{ width: 40, height: 40 }}
                />
              )}
              <Box>
                <Typography variant="body2">
                  {parsed.type === 'ONLINE_POLL' ? 'Checking who is online' : 'User is online'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {onlineData.name || parsed.senderId}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      
      default:
        // Fallback for other message types
        return (
          <Box>
            <MessageMeta />
            <Box 
              component="pre" 
              sx={{ 
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0
              }}
            >
              {typeof parsed.payload === 'string' ? parsed.payload : JSON.stringify(parsed.payload, null, 2)}
            </Box>
          </Box>
        );
    }
  } catch (_) {
    // Fallback for parsing errors
    return (
      <Box 
        component="pre" 
        sx={{ 
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0
        }}
      >
        {message}
      </Box>
    );
  }
};

export default function MessageViewer() {
  const { messages, clearMessages } = useMQTT();
  const [filter, setFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterDuplicates, setFilterDuplicates] = useState(true);
  const [messageListRef, setMessageListRef] = useState<HTMLDivElement | null>(null);

  // Create a filtered list of messages with duplicate detection
  const filteredMessages = useMemo(() => {
    // First filter by topic
    let filtered = messages.filter(msg => 
      !filter || msg.topic.includes(filter)
    );
    
    // Then filter out duplicates if enabled
    if (filterDuplicates) {
      const seen = new Map();
      filtered = filtered.filter((msg, index) => {
        // Create a key from topic + message content + retained status
        // This ensures retained messages are treated differently from non-retained ones
        const key = `${msg.topic}:${msg.message}:${msg.retained ? 'retained' : 'normal'}`;
        
        // If we haven't seen this message before, or it's the first occurrence, keep it
        if (!seen.has(key)) {
          seen.set(key, index);
          return true;
        }
        
        // If we've seen this message before, only keep it if it's more than 2 seconds apart
        const prevIndex = seen.get(key);
        const timeDiff = msg.timestamp.getTime() - messages[prevIndex].timestamp.getTime();
        if (timeDiff > 2000) { // 2 seconds threshold
          seen.set(key, index);
          return true;
        }
        
        return false;
      });
    }
    
    return filtered;
  }, [messages, filter, filterDuplicates]);

  useEffect(() => {
    if (autoScroll && messageListRef) {
      messageListRef.scrollTop = messageListRef.scrollHeight;
    }
  }, [filteredMessages, autoScroll, messageListRef]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const formatMessage = (msg: string) => {
    try {
      const parsed = JSON.parse(msg);
      return JSON.stringify(parsed, null, 2);
    } catch (_) {
      return msg;
    }
  };

  const isJsonString = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const getMessageTypeInfo = (message: string) => {
    try {
      const parsed = JSON.parse(message);
      
      // Check if it's a ThatsApp message with type field
      if (parsed && typeof parsed === 'object' && parsed.type) {
        const messageType = parsed.type.toString().toUpperCase();
        
        // Map of message types to icons and colors
        const typeInfo = {
          'TEXT': { 
            icon: <TextSnippetIcon fontSize="small" />, 
            label: 'Text', 
            color: 'primary' 
          },
          'IMAGE': { 
            icon: <ImageIcon fontSize="small" />, 
            label: 'Image', 
            color: 'secondary' 
          },
          'LOCATION': { 
            icon: <LocationOnIcon fontSize="small" />, 
            label: 'Location', 
            color: 'success' 
          },
          'PROFILE_UPDATE': { 
            icon: <PersonIcon fontSize="small" />, 
            label: 'Profile', 
            color: 'info' 
          },
          'REQUEST_PROFILE': { 
            icon: <PersonIcon fontSize="small" />, 
            label: 'Profile Request', 
            color: 'info' 
          },
          'TYPING': { 
            icon: <KeyboardIcon fontSize="small" />, 
            label: 'Typing', 
            color: 'default' 
          },
          'ONLINE_POLL': { 
            icon: <SignalWifiStatusbar4BarIcon fontSize="small" />, 
            label: 'Online Poll', 
            color: 'warning' 
          },
          'ONLINE_RESPONSE': { 
            icon: <SignalWifiStatusbar4BarIcon fontSize="small" />, 
            label: 'Online Response', 
            color: 'warning' 
          }
        };
        
        return typeInfo[messageType] || { 
          icon: <HelpOutlineIcon fontSize="small" />, 
          label: messageType, 
          color: 'default' 
        };
      }
      
      return null;
    } catch (_) {
      return null;
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Messages
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
            }
            label="Auto-scroll"
            sx={{ mr: 1 }}
          />
          <Tooltip title="Filter out duplicate messages">
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={filterDuplicates}
                  onChange={(e) => setFilterDuplicates(e.target.checked)}
                />
              }
              label="Filter duplicates"
              sx={{ mr: 1 }}
            />
          </Tooltip>
          <IconButton 
            size="small" 
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? "primary" : "default"}
          >
            <FilterListIcon />
          </IconButton>
          <Button 
            size="small" 
            startIcon={<ClearIcon />} 
            onClick={clearMessages}
            disabled={messages.length === 0}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Filter by topic"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Enter topic filter"
          />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {filterDuplicates && filteredMessages.length !== messages.length ? 
                `${messages.length - filteredMessages.length} duplicates filtered out` : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredMessages.length} of {messages.length} messages
            </Typography>
          </Box>
        </Box>
      </Collapse>

      <Box 
        ref={setMessageListRef}
        sx={{ 
          flexGrow: 1,
          maxHeight: '700px',
          overflowY: 'auto', 
          border: '1px solid rgba(255, 255, 255, 0.12)', 
          borderRadius: 1,
          bgcolor: 'background.paper' 
        }}
      >
        {filteredMessages.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No messages received yet. Subscribe to topics to see messages.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredMessages.map((msg, idx) => (
              <Box key={idx}>
                {idx > 0 && <Divider />}
                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={msg.topic} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                      />
                      {msg.retained && (
                        <Tooltip title="Retained message">
                          <Chip
                            icon={<BookmarkIcon fontSize="small" />}
                            label="Retained"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        </Tooltip>
                      )}
                      {/* Message type chip */}
                      {isJsonString(msg.message) && getMessageTypeInfo(msg.message) && (
                        <Tooltip title={`Message type: ${getMessageTypeInfo(msg.message)?.label}`}>
                          <Chip
                            icon={getMessageTypeInfo(msg.message)?.icon}
                            label={getMessageTypeInfo(msg.message)?.label}
                            size="small"
                            color={getMessageTypeInfo(msg.message)?.color as any}
                            variant="outlined"
                          />
                        </Tooltip>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(msg.timestamp)}
                    </Typography>
                  </Box>
                  
                  {/* Enhanced message display */}
                  {isJsonString(msg.message) && getMessageTypeInfo(msg.message) ? (
                    <Box sx={{ width: '100%' }}>
                      <Box 
                        sx={{ 
                          mt: 1,
                          p: 1.5,
                          bgcolor: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <MessageContent message={msg.message} />
                      </Box>
                    </Box>
                  ) : (
                    <Box 
                      component="pre" 
                      sx={{ 
                        width: '100%', 
                        mt: 1, 
                        p: 1, 
                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                        borderRadius: 1,
                        overflow: 'auto',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '300px'
                      }}
                    >
                      {isJsonString(msg.message) ? formatMessage(msg.message) : msg.message}
                    </Box>
                  )}
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}