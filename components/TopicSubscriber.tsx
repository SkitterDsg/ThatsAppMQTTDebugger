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
import { motion, AnimatePresence } from 'framer-motion';
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

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
        delayChildren: 0.2 // Add a slight delay for the second component
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  const chipVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      } 
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      } 
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    },
    tap: { scale: 0.95 }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
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
          p: 2.5, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(28, 32, 50, 0.6) 0%, rgba(18, 20, 30, 0.75) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.25)',
          opacity: isConnected ? 1 : 0.7,
          position: 'relative',
          overflow: 'hidden'
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
              Connect to MQTT to manage subscriptions
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
            Topic Subscriptions
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

        <motion.div variants={itemVariants}>
          <Box display="flex" gap={1} sx={{ mb: 2 }}>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  transition: "all 0.3s ease"
                }
              }}
            />
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubscribe}
                disabled={!isConnected || !topic.trim()}
                sx={{ 
                  borderRadius: 1.5,
                  height: "100%",
                  px: 2,
                  fontWeight: 500,
                  textTransform: "none"
                }}
              >
                Subscribe
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              mb: 1.5
            }}
          >
            Subscribed Topics:
          </Typography>
        </motion.div>
        
        <AnimatePresence>
          {subscribedTopics.length === 0 ? (
            <motion.div
              key="no-topics"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No topics subscribed yet.
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="topic-list"
              variants={itemVariants}
            >
              <List dense sx={{ padding: 0 }}>
                <AnimatePresence initial={false}>
                  {subscribedTopics.map((t) => (
                    <motion.div
                      key={t}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <ListItem 
                        disablePadding 
                        sx={{ 
                          py: 0.5
                        }}
                      >
                        <motion.div 
                          variants={chipVariants}
                          whileHover="hover"
                          whileTap="tap"
                          layout
                        >
                          <Chip
                            label={t}
                            onDelete={() => unsubscribe(t)}
                            color="primary"
                            variant="outlined"
                            sx={{ 
                              fontWeight: 500,
                              borderRadius: 6,
                              transition: "all 0.3s ease",
                              px: 0.5,
                              "& .MuiChip-deleteIcon": {
                                color: "rgba(255, 255, 255, 0.7)",
                                "&:hover": {
                                  color: "rgba(255, 255, 255, 0.9)"
                                }
                              }
                            }}
                          />
                        </motion.div>
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
}