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
  FormControlLabel,
  Switch,
  Tooltip,
  Avatar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Define animation variants for JSON view
  const jsonViewVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      overflow: 'hidden'
    },
    visible: { 
      height: 'auto',
      opacity: 1,
      transition: {
        height: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.1 }
      }
    }
  };
  
  try {
    const parsed = JSON.parse(message);
    
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
      </Box>
    );
    
    // Not a ThatsApp message, just show formatted JSON
    if (!parsed.type) {
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
    
    // Generate the formatted content based on message type
    const FormattedContent = () => {
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
    };
    
    // Render the content with animation, making the entire area clickable
    return (
      <Box 
        sx={{ 
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 1,
              pointerEvents: 'none' // Ensures clicks go through to the underlying content
            }
          }
        }}
        onClick={() => setShowRawJson(!showRawJson)}
      >
        {/* Small indicator in top-right corner */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            py: 0.5,
            px: 1,
            borderRadius: '0 0 0 4px',
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            fontSize: '0.6rem',
            color: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
            pointerEvents: 'none' // Ensures clicks go through to the underlying content
          }}
        >
          {showRawJson ? 'Raw JSON' : 'Formatted'}
        </Box>
        
        <AnimatePresence mode="wait" initial={false}>
          {showRawJson ? (
            <motion.div
              key="raw-json"
              variants={jsonViewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box 
                component="pre" 
                sx={{ 
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                {JSON.stringify(parsed, null, 2)}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="formatted-view"
              variants={jsonViewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <FormattedContent />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      delayChildren: 0.4 // Add a delay for the fourth component
    }
  }
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.02,
      when: "beforeChildren",
      duration: 0.1
    }
  }
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "tween", 
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: 0.1 } 
  }
};

// Custom animation for new messages
const newMessageAnimationVariants = {
  initial: {
    borderLeft: '3px solid rgba(57, 73, 171, 0)',
    backgroundColor: 'rgba(57, 73, 171, 0)'
  },
  animate: {
    borderLeft: ['3px solid rgba(57, 73, 171, 0.4)', '3px solid rgba(57, 73, 171, 0)'],
    backgroundColor: ['rgba(57, 73, 171, 0.03)', 'rgba(57, 73, 171, 0)'],
    transition: {
      duration: 0.8,
      times: [0, 1],
      ease: "easeOut"
    }
  }
};

const filterVariants = {
  closed: { height: 0, opacity: 0 },
  open: { 
    height: "auto", 
    opacity: 1,
    transition: { 
      height: { type: "spring", stiffness: 300, damping: 25 },
      opacity: { duration: 0.2 }
    }
  }
};

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
  const prevAutoScroll = useRef(autoScroll);
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
    const MAX_DISPLAY_MESSAGES = 100;
    if (filtered.length > MAX_DISPLAY_MESSAGES) {
      filtered = filtered.slice(filtered.length - MAX_DISPLAY_MESSAGES, filtered.length);
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
      // Performance optimization: only animate up to 3 newest messages if there are many
      // for very high volumes (>10), disable animations completely to prevent visual chaos
      const messagesToAnimate = newMessages.length > 10 ? [] : 
                               newMessages.length > 3 ? newMessages.slice(0, 3) : newMessages;
      
      // Add the new messages to animatedMessageIds
      setAnimatedMessageIds(prev => {
        const updated = new Set(prev);
        messagesToAnimate.forEach(id => updated.add(id));
        return updated;
      });
      
      // Update reference immediately
      messagesIdsRef.current = currentMessageIds;
      
      // We'll handle the "New messages" indicator in the main auto-scroll effect
      
      // Clear animations after they complete
      messagesToAnimate.forEach(id => {
        setTimeout(() => {
          setAnimatedMessageIds(prev => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
        }, 800);
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
  
  // Track previous messages length to detect new additions
  const prevMessagesLengthRef = useRef(0);
  
  // Auto-scroll effect with smooth animation
  useEffect(() => {
    if (!messageListRef) return;
    
    // Check if we've actually added new messages
    const hasNewMessages = filteredMessages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = filteredMessages.length;
    
    // Always check if container is actually scrollable
    const isScrollable = messageListRef.scrollHeight > messageListRef.clientHeight;
    
    // Update new messages below view indicator state
    if (!isScrollable) {
      // If container is not scrollable, never show the indicator
      setNewMessagesBelowView(false);
    } else if (autoScroll) {
      // If auto-scroll is on, indicator should be off
      setNewMessagesBelowView(false);
    } else if (hasNewMessages) {
      // Auto-scroll is off and we have new messages, check if we're at the bottom
      const isAtBottom = messageListRef.scrollHeight - messageListRef.scrollTop - messageListRef.clientHeight < 20;
      // Only show indicator if not at the bottom
      setNewMessagesBelowView(!isAtBottom);
    }
    
    // Handle scrolling when appropriate
    if (autoScroll && (hasNewMessages || prevAutoScroll.current !== autoScroll)) {
      // Check if we're already near the bottom to determine if we should smooth scroll
      const isNearBottom = messageListRef.scrollHeight - messageListRef.scrollTop - messageListRef.clientHeight < 100;
      
      if (isNearBottom) {
        // Add a small delay to allow for DOM rendering
        setTimeout(() => {
          // Use smooth scroll animation for a better experience when new messages arrive
          messageListRef.scrollTo({
            top: messageListRef.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      } else {
        // If user has scrolled up significantly but auto-scroll is enabled,
        // just update position instantly
        messageListRef.scrollTop = messageListRef.scrollHeight;
      }
    }
    
    // Store current auto-scroll value for next comparison
    prevAutoScroll.current = autoScroll;
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Paper 
        component={motion.div}
        sx={{ 
          p: 2.5, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(28, 32, 50, 0.6) 0%, rgba(18, 20, 30, 0.75) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.25)',
          borderRadius: 2
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
              <Typography variant="body2" sx={{ fontSize: '0.8rem', ml: 0.5 }}>
                Auto-scroll
              </Typography>
            }
            sx={{ mr: 2, my: 0 }}
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
                <Typography variant="body2" sx={{ fontSize: '0.8rem', ml: 0.5 }}>
                  Filter duplicates
                </Typography>
              }
              sx={{ mr: 2, my: 0 }}
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

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={filterVariants}
          >
            <Box sx={{ mb: 2.5, overflow: 'hidden' }}>
              <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
              >
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
                      borderRadius: '12px',
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.15)',
                        boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.2)'
                      },
                      '&:focus-within': {
                        boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.3)'
                      }
                    }
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {filterDuplicates && messages.filter(msg => !filter || msg.topic.includes(filter)).length !== filteredMessages.length ? 
                      `${messages.filter(msg => !filter || msg.topic.includes(filter)).length - filteredMessages.length} messages filtered` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {filteredMessages.length} of {messages.length} messages 
                    {filteredMessages.length < messages.length && filteredMessages.length === 100 ? 
                      ' (showing latest 100)' : ''}
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ position: 'relative', flexGrow: 1 }}>
        <Box 
          ref={setMessageListRef}
          sx={{ 
            height: '100%',
            maxHeight: '700px',
            overflowY: 'auto', 
            overflowX: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(10, 12, 22, 0.6) 0%, rgba(15, 17, 26, 0.4) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            // Add CSS containment for performance optimization
            contain: 'content'
          }}
      >
        <AnimatePresence mode="wait">
          {filteredMessages.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ height: '100%' }}
            >
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    times: [0, 0.5, 1]
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                    Subscribe to topics to see messages appear here
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>
          ) : (
          <motion.div
            key="message-list"
            initial="hidden"
            animate="visible"
            variants={listVariants}
          >
            <List 
              disablePadding
              component={motion.ul}
              sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(auto-fill, auto)',
                width: '100%',
                overflow: 'hidden'
              }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {filteredMessages.map((msg, idx) => {
                  const messageId = getMessageId(msg, idx);
                  const isNewMessage = animatedMessageIds.has(messageId);
                  return (
                    <motion.div
                      key={messageId}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout="position"
                      style={{ overflow: 'hidden', width: '100%' }}
                    >
                      {idx > 0 && <Divider />}
                      <Box sx={{ width: '100%', position: 'relative' }}>
                        <motion.div
                          variants={newMessageAnimationVariants}
                          initial="initial"
                          animate={isNewMessage ? "animate" : "initial"}
                          style={{ borderRadius: 8 }}
                          whileHover={{ 
                            scale: 1.01, 
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            transition: { duration: 0.2 }
                          }}
                        >
                          <ListItem 
                            sx={{ 
                              flexDirection: 'column', 
                              alignItems: 'flex-start', 
                              py: 1.5,
                              px: 2,
                              my: 0.75,
                              mx: 0.5,
                              borderRadius: 2,
                              border: '1px solid transparent'
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
                        </motion.div>
                      </Box>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </List>
          </motion.div>
        )}
        </AnimatePresence>
        </Box>
        
        {/* New messages indicator with Framer Motion */}
        <AnimatePresence>
          {newMessagesBelowView && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                translateX: '-50%',
                zIndex: 2
              }}
              onClick={() => {
                if (messageListRef) {
                  messageListRef.scrollTo({
                    top: messageListRef.scrollHeight,
                    behavior: 'smooth'
                  });
                  setNewMessagesBelowView(false);
                }
              }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  y: { 
                    repeat: Infinity,
                    duration: 2,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }
                }}
                style={{
                  backgroundColor: '#5C6BC0',
                  borderRadius: 20,
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                }}
              >
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 24, 
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  ↓
                </motion.div>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  New messages
                </Typography>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Paper>
    </motion.div>
  );
}