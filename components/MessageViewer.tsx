import { useEffect, useState, useMemo, useRef } from 'react';
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
  Avatar,
  Fade
} from '@mui/material';
import { keyframes } from '@mui/system';
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

// Define animations

const glowHighlight = keyframes`
  0% {
    background-color: rgba(57, 73, 171, 0);
    border-left-color: rgba(57, 73, 171, 0);
  }
  20% {
    background-color: rgba(57, 73, 171, 0.05);
    border-left-color: rgba(57, 73, 171, 0.4);
  }
  80% {
    background-color: rgba(57, 73, 171, 0.02);
    border-left-color: rgba(57, 73, 171, 0.2);
  }
  100% {
    background-color: rgba(0, 0, 0, 0);
    border-left-color: rgba(0, 0, 0, 0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function MessageViewer() {
  const { messages, clearMessages } = useMQTT();
  const [filter, setFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterDuplicates, setFilterDuplicates] = useState(true);
  const [messageListRef, setMessageListRef] = useState<HTMLDivElement | null>(null);
  const [newMessagesBelowView, setNewMessagesBelowView] = useState(false);
  
  // Track messages for animations
  const messagesIdsRef = useRef<string[]>([]);
  const [animatedMessageIds, setAnimatedMessageIds] = useState<Set<string>>(new Set());

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
    
    // For performance, limit the number of messages shown if there are too many
    // This prevents performance degradation with large message volumes
    const MAX_DISPLAY_MESSAGES = 150;
    if (filtered.length > MAX_DISPLAY_MESSAGES) {
      filtered = filtered.slice(0, MAX_DISPLAY_MESSAGES);
    }
    
    return filtered;
  }, [messages, filter, filterDuplicates]);

  // Generate unique IDs for messages to track them better
  const getMessageId = (msg: any, index: number) => {
    return `${msg.topic}-${msg.timestamp.getTime()}-${index}`;
  };
  
  // Effect to detect new messages for animation
  useEffect(() => {
    if (messages.length === 0) {
      // Reset tracking when all messages are cleared
      messagesIdsRef.current = [];
      setAnimatedMessageIds(new Set());
      return;
    }
    
    // Generate IDs for current messages
    const currentMessageIds = messages.map(getMessageId);
    
    // Check if we have new messages by comparing current with previous
    const newMessages = currentMessageIds.filter(id => !messagesIdsRef.current.includes(id));
    
    if (newMessages.length > 0) {
      // Performance optimization: only animate up to 5 newest messages if there are many
      const messagesToAnimate = newMessages.length > 5 ? newMessages.slice(0, 5) : newMessages;
      
      // Add the new messages to animatedMessageIds
      setAnimatedMessageIds(prev => {
        const updated = new Set(prev);
        messagesToAnimate.forEach(id => updated.add(id));
        return updated;
      });
      
      // Update reference immediately
      messagesIdsRef.current = currentMessageIds;
      
      // Show "New messages" indicator if auto-scroll is off or user has scrolled up
      if (messageListRef) {
        const isNearBottom = messageListRef.scrollHeight - messageListRef.scrollTop - messageListRef.clientHeight < 100;
        if (!autoScroll || !isNearBottom) {
          setNewMessagesBelowView(true);
        }
      }
      
      // Clear animations after they complete
      messagesToAnimate.forEach(id => {
        setTimeout(() => {
          setAnimatedMessageIds(prev => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
        }, 1600);
      });
    } else {
      // Update the reference if no new messages
      messagesIdsRef.current = currentMessageIds;
    }
  }, [messages, messageListRef, autoScroll]);
  
  // We no longer need the effect to find index in filtered list
  // since we now track message IDs directly

  // Set up scroll listener to detect when we're not at the bottom
  useEffect(() => {
    if (!messageListRef) return;
    
    const handleScroll = () => {
      if (!messageListRef) return;
      
      const isNearBottom = messageListRef.scrollHeight - messageListRef.scrollTop - messageListRef.clientHeight < 100;
      
      // If auto-scroll is off and we're not at the bottom, we might need to show the new message indicator
      if (!autoScroll || !isNearBottom) {
        setNewMessagesBelowView(false); // Reset it first (will be set to true if new messages arrive)
      }
    };
    
    messageListRef.addEventListener('scroll', handleScroll);
    return () => {
      messageListRef.removeEventListener('scroll', handleScroll);
    };
  }, [messageListRef, autoScroll]);
  
  // Auto-scroll effect with smooth animation
  useEffect(() => {
    if (!messageListRef) return;
    
    // If messages changed and auto-scroll is on
    if (autoScroll) {
      // Check if we're already near the bottom to determine if we should smooth scroll
      const isNearBottom = messageListRef.scrollHeight - messageListRef.scrollTop - messageListRef.clientHeight < 100;
      
      if (isNearBottom) {
        // Use smooth scroll animation for a better experience when new messages arrive
        messageListRef.scrollTo({
          top: messageListRef.scrollHeight,
          behavior: 'smooth'
        });
        setNewMessagesBelowView(false);
      } else {
        // If user has scrolled up significantly but auto-scroll is enabled,
        // just update position instantly
        messageListRef.scrollTop = messageListRef.scrollHeight;
        setNewMessagesBelowView(false);
      }
    } else if (filteredMessages.length > 0) {
      // Auto-scroll is off, indicate new messages might be below
      const isAtBottom = messageListRef.scrollHeight - messageListRef.scrollTop - messageListRef.clientHeight < 20;
      if (!isAtBottom) {
        setNewMessagesBelowView(true);
      }
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
    <Paper 
      sx={{ 
        p: 2.5, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'rgba(30, 30, 36, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          Messages
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: { xs: 'flex-end', sm: 'flex-end' },
          gap: 0.5
        }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                Auto-scroll
              </Typography>
            }
            sx={{ mr: 2 }}
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
              label={
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  Filter duplicates
                </Typography>
              }
              sx={{ mr: 2 }}
            />
          </Tooltip>
          <IconButton 
            size="small" 
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? "primary" : "default"}
            sx={{ 
              bgcolor: showFilters ? 'rgba(92, 107, 192, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: showFilters ? 'rgba(92, 107, 192, 0.15)' : 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
          <Button 
            size="small" 
            startIcon={<ClearIcon fontSize="small" />} 
            onClick={clearMessages}
            disabled={messages.length === 0}
            variant="outlined"
            sx={{ 
              ml: 0.5,
              borderRadius: '6px',
              textTransform: 'none',
              fontSize: '0.8rem'
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ mb: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            label="Filter by topic"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Enter topic filter"
            InputProps={{
              sx: {
                borderRadius: '8px',
                bgcolor: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.15)'
                }
              }
            }}
          />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {filterDuplicates && filteredMessages.length !== messages.length ? 
                `${messages.length - filteredMessages.length} duplicates filtered out` : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {filteredMessages.length} of {messages.length} messages
            </Typography>
          </Box>
        </Box>
      </Collapse>

      <Box sx={{ position: 'relative', flexGrow: 1 }}>
        <Box 
          ref={setMessageListRef}
          sx={{ 
            height: '100%',
            maxHeight: '700px',
            overflowY: 'auto', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: 2,
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            // Add CSS containment for performance optimization
            contain: 'content'
          }}
      >
        {filteredMessages.length === 0 ? (
          <Fade in={true} timeout={500}>
            <Box sx={{ 
              p: 4, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Box 
                sx={{ 
                  mb: 2,
                  opacity: 0.5
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  mb: 1
                }}
              >
                No messages received yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                Subscribe to topics to see messages appear here
              </Typography>
            </Box>
          </Fade>
        ) : (
          <List 
            disablePadding
            sx={{
              transition: 'all 0.3s ease',
            }}
            {filteredMessages.map((msg, idx) => (
              <Box key={idx}>
                {idx > 0 && <Divider />}
                <Box
                  sx={{
                    width: '100%',
                    position: 'relative'
                  }}
                >
                {/* Get message ID to check if it's being animated */}
                {(() => {
                  const messageId = getMessageId(msg, idx);
                  const isNewMessage = animatedMessageIds.has(messageId);
                  return (
                    <ListItem 
                      sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start', 
                        py: 1.5,
                        px: 2,
                        my: 0.75,
                        mx: 0.5,
                        borderRadius: 2,
                        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                        animation: isNewMessage ? 
                          `${glowHighlight} 1.6s ease-in-out, ${slideIn} 0.3s ease-out` : 'none',
                        backgroundColor: 'transparent',
                        border: '1px solid transparent',
                        borderLeft: isNewMessage ? '3px solid rgba(57, 73, 171, 0.4)' : '3px solid transparent',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                >
                  <Box sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 0.75,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: { xs: 0.5, sm: 0 }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.75, 
                      flexWrap: 'wrap',
                      maxWidth: { xs: '100%', sm: '80%' }
                    }}>
                      <Chip 
                        label={msg.topic} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                        sx={{ 
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(92, 107, 192, 0.15)'
                        }}
                      />
                      {msg.retained && (
                        <Tooltip title="Retained message">
                          <Chip
                            icon={<BookmarkIcon sx={{ fontSize: '0.85rem' }} />}
                            label="Retained"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ 
                              height: '24px',
                              fontSize: '0.7rem',
                              borderRadius: '12px',
                              backgroundColor: 'rgba(255, 167, 38, 0.15)'
                            }}
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
                            sx={{ 
                              height: '24px',
                              fontSize: '0.7rem',
                              borderRadius: '12px',
                              fontWeight: 500,
                              backgroundColor: msg.retained ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.7rem',
                        opacity: 0.7,
                        letterSpacing: 0.5,
                        fontWeight: 500,
                        mt: { xs: 0.5, sm: 0 } 
                      }}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </Typography>
                  </Box>
                  
                  {/* Enhanced message display */}
                  {isJsonString(msg.message) && getMessageTypeInfo(msg.message) ? (
                    <Box sx={{ width: '100%' }}>
                      <Box 
                        sx={{ 
                          mt: 1,
                          p: 1.75,
                          bgcolor: 'rgba(0, 0, 0, 0.15)',
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
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
                        p: 1.75, 
                        bgcolor: 'rgba(0, 0, 0, 0.15)', 
                        borderRadius: 2,
                        overflow: 'auto',
                        fontSize: '0.85rem',
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '300px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                        lineHeight: 1.5
                      }}
                    >
                      {isJsonString(msg.message) ? formatMessage(msg.message) : msg.message}
                    </Box>
                  )}
                </ListItem>
                  )
                })()}
                </Box>
              </Box>
            ))}
          </List>
        )}
        </Box>
        
        {/* New messages indicator */}
        <Fade in={newMessagesBelowView}>
          <Box 
            onClick={() => {
              if (messageListRef) {
                messageListRef.scrollTo({
                  top: messageListRef.scrollHeight,
                  behavior: 'smooth'
                });
                setNewMessagesBelowView(false);
              }
            }}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 20,
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateX(-50%) translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              },
              animation: `${keyframes`
                0%, 100% { transform: translateX(-50%); }
                5% { transform: translateX(-50%) translateY(-3px); }
                15% { transform: translateX(-50%) translateY(0); }
              `} 4s infinite`
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 24, 
                height: 24,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              ↓
            </Box>
            <Typography variant="body2">New messages</Typography>
          </Box>
        </Fade>
      </Box>
    </Paper>
  );
}