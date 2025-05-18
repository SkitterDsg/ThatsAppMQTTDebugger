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
        duration: 0.3
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
          mb: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(30, 30, 36, 0.6)',
          backdropFilter: "blur(8px)",
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
      >
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              color: "primary.light"
            }}
          >
            Topic Subscriptions
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