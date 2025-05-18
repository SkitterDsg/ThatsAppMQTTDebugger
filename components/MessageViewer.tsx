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
  Tooltip
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useMQTT } from '../contexts/MQTTContext';

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
        // Create a key from topic + message content
        const key = `${msg.topic}:${msg.message}`;
        
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
    } catch (e) {
      return msg;
    }
  };

  const isJsonString = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
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
          minHeight: '700px', 
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
                    <Chip 
                      label={msg.topic} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(msg.timestamp)}
                    </Typography>
                  </Box>
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
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}