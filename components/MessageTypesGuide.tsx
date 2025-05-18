import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip,
  Stack,
  Alert,
  Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
// Removed unused imports

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`message-types-tabpanel-${index}`}
      aria-labelledby={`message-types-tab-${index}`}
      style={{ padding: '16px 0' }}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `message-types-tab-${index}`,
    'aria-controls': `message-types-tabpanel-${index}`,
  };
}

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="pre"
    sx={{
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 1,
      p: 2,
      overflow: 'auto',
      fontSize: '0.85rem',
      fontFamily: 'monospace',
      my: 2
    }}
  >
    {children}
  </Box>
);

export default function MessageTypesGuide() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Button 
        onClick={handleOpen} 
        startIcon={<InfoIcon />}
        variant="outlined"
        color="inherit"
        size="small"
        sx={{ 
          ml: 1,
          borderColor: 'rgba(255,255,255,0.3)',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.5)',
            backgroundColor: 'rgba(255,255,255,0.05)'
          }
        }}
      >
        Message Types Guide
      </Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="message-types-guide-title"
        aria-describedby="message-types-guide-description"
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="message-types-guide-title" variant="h5" component="h2">
                ThatsApp Message Types Guide
              </Typography>
              <IconButton 
                aria-label="close" 
                onClick={handleClose}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This guide clarifies the correct implementation of ThatsApp messaging protocol to ensure compatibility between different client implementations.
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                aria-label="message types guide tabs"
              >
                <Tab label="Message Types" {...a11yProps(0)} />
                <Tab label="Recipient Standards" {...a11yProps(1)} />
                <Tab label="Implementation Notes" {...a11yProps(2)} />
                <Tab label="Common Mistakes" {...a11yProps(3)} />
                <Tab label="Topic Structure" {...a11yProps(4)} />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>Message Types Overview</Typography>
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextSnippetIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">TEXT</Typography>
                  </Box>
                  <Typography variant="body2">
                    Regular text messages sent between users. Payload is the message text.
                  </Typography>
                  <Chip 
                    label="Direct message" 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mt: 1 }} 
                  />
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ImageIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">IMAGE</Typography>
                  </Box>
                  <Typography variant="body2">
                    Image URL messages. Payload is the URL to the image.
                  </Typography>
                  <Chip 
                    label="Direct message" 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mt: 1 }} 
                  />
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">LOCATION</Typography>
                  </Box>
                  <Typography variant="body2">
                    Location data messages. Payload is a JSON object with latitude and longitude.
                  </Typography>
                  <Chip 
                    label="Direct message" 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mt: 1 }} 
                  />
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">PROFILE_UPDATE</Typography>
                  </Box>
                  <Typography variant="body2">
                    Profile information updates. Payload is a JSON object with name and avatarUrl.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip 
                      label="Direct message" 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label="Global message" 
                      size="small" 
                      color="warning" 
                      variant="outlined" 
                    />
                  </Stack>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">REQUEST_PROFILE</Typography>
                  </Box>
                  <Typography variant="body2">
                    Request for profile information. Payload is typically empty.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip 
                      label="Direct message" 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label="Global message" 
                      size="small" 
                      color="warning" 
                      variant="outlined" 
                    />
                  </Stack>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <KeyboardIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">TYPING</Typography>
                  </Box>
                  <Typography variant="body2">
                    Typing indicators. Payload is typically empty.
                  </Typography>
                  <Chip 
                    label="Direct message" 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mt: 1 }} 
                  />
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SignalWifiStatusbar4BarIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">ONLINE_POLL</Typography>
                  </Box>
                  <Typography variant="body2">
                    Request to check who&apos;s online. Payload is a JSON object with name and avatarUrl.
                  </Typography>
                  <Chip 
                    label="Global message" 
                    size="small" 
                    color="warning" 
                    variant="outlined" 
                    sx={{ mt: 1 }} 
                  />
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SignalWifiStatusbar4BarIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">ONLINE_RESPONSE</Typography>
                  </Box>
                  <Typography variant="body2">
                    Response to an online poll. Payload is a JSON object with name and avatarUrl.
                  </Typography>
                  <Chip 
                    label="Global message" 
                    size="small" 
                    color="warning" 
                    variant="outlined" 
                    sx={{ mt: 1 }} 
                  />
                </Paper>
              </Stack>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>Message Recipient Standards</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Global Messages</Typography>
                <Typography variant="body2" paragraph>
                  The following message types should use <code>&quot;global&quot;</code> as the <code>recipientId</code> and be sent to the global topic (<code>thatsapp/publictest/global</code>):
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" component="ul">
                    <li><strong>ONLINE_POLL</strong>: When asking who&apos;s online</li>
                    <li><strong>ONLINE_RESPONSE</strong>: When responding to an online poll</li>
                  </Typography>
                </Box>
                
                <CodeBlock>
{`// CORRECT implementation of ONLINE_RESPONSE
val message = Message(
    senderId = username,
    recipientId = "global", // MUST be "global" for global messages
    timestamp = System.currentTimeMillis(),
    type = MessageType.ONLINE_RESPONSE,
    payload = payload
)`}
                </CodeBlock>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Dual-Mode Messages</Typography>
                <Typography variant="body2" paragraph>
                  The following message types can be used in both direct and global mode:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" component="ul">
                    <li><strong>PROFILE_UPDATE</strong>: When sending your profile info to users</li>
                    <li><strong>REQUEST_PROFILE</strong>: When requesting profile information</li>
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Global PROFILE_UPDATE (efficient broadcast to all users):</Typography>
                <CodeBlock>
{`// CORRECT implementation of global PROFILE_UPDATE
val message = Message(
    senderId = username,
    recipientId = "global", // Use "global" to broadcast to everyone
    timestamp = System.currentTimeMillis(),
    type = MessageType.PROFILE_UPDATE,
    payload = profilePayload
)`}
                </CodeBlock>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Direct PROFILE_UPDATE (targeted to specific users):</Typography>
                <CodeBlock>
{`// CORRECT implementation of direct PROFILE_UPDATE
val message = Message(
    senderId = username,
    recipientId = partnerId, // Use specific user ID for direct updates
    timestamp = System.currentTimeMillis(),
    type = MessageType.PROFILE_UPDATE,
    payload = profilePayload
)`}
                </CodeBlock>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>Direct Messages</Typography>
                <Typography variant="body2" paragraph>
                  The following message types should use a specific user&apos;s ID as the <code>recipientId</code> and be sent to that user&apos;s topic:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" component="ul">
                    <li><strong>TEXT</strong>: Regular text messages</li>
                    <li><strong>IMAGE</strong>: Image URL messages</li>
                    <li><strong>LOCATION</strong>: Location data messages</li>
                    <li><strong>TYPING</strong>: When sending typing indicators</li>
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>Implementation Notes</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Message Format</Typography>
                <Typography variant="body2" paragraph>
                  All ThatsApp messages follow this standard format:
                </Typography>
                <CodeBlock>
{`{
  "senderId": "user123",      // Unique ID of the sender
  "recipientId": "user456",   // Unique ID of the recipient or "global"
  "timestamp": 1685432789012, // Message timestamp in milliseconds
  "type": "TEXT",             // Message type (TEXT, IMAGE, etc.)
  "payload": "Hello world!"   // Message content (format depends on type)
}`}
                </CodeBlock>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Handling PROFILE_UPDATE Messages</Typography>
                <Typography variant="body2" paragraph>
                  When handling <code>PROFILE_UPDATE</code> messages, your client should check the <code>recipientId</code> field:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" component="ul">
                    <li>If <code>recipientId</code> is <code>&quot;global&quot;</code>, update contact info but don&apos;t add to chat history</li>
                    <li>If <code>recipientId</code> is a specific user ID, update contact info and add to chat history</li>
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>Handling REQUEST_PROFILE Messages</Typography>
                <Typography variant="body2" paragraph>
                  When receiving a <code>REQUEST_PROFILE</code> message:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" component="ul">
                    <li>Check the <code>recipientId</code> field to determine if it&apos;s a direct or global request</li>
                    <li>Respond with the appropriate <code>PROFILE_UPDATE</code> (direct or global)</li>
                    <li>For global requests, only respond if you want to make your profile visible to everyone</li>
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>Common Implementation Mistakes</Typography>
              
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="subtitle1">
                  Sending ONLINE_RESPONSE to specific recipients
                </Typography>
                <CodeBlock>
{`// INCORRECT implementation
val message = Message(
    senderId = username,
    recipientId = pollSender, // WRONG! Should be "global"
    timestamp = System.currentTimeMillis(),
    type = MessageType.ONLINE_RESPONSE,
    payload = payload
)`}
                </CodeBlock>
                <Typography variant="body2">
                  This prevents other clients from seeing the response and updating their online user lists correctly.
                </Typography>
              </Alert>
              
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="subtitle1">
                  Using incorrect topic for message type
                </Typography>
                <Typography variant="body2">
                  Sending global messages to direct topics or vice versa can cause compatibility issues with other clients.
                </Typography>
              </Alert>
              
              <Alert severity="warning">
                <Typography variant="subtitle1">
                  Incorrect payload format
                </Typography>
                <Typography variant="body2">
                  Each message type expects a specific payload format. Using incorrect formats can cause parsing errors in other clients.
                </Typography>
              </Alert>
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" gutterBottom>Topic Structure</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Global Topic</Typography>
                <CodeBlock>thatsapp/publictest/global</CodeBlock>
                <Typography variant="body2">
                  Used for messages intended for all clients, such as <code>ONLINE_POLL</code>, <code>ONLINE_RESPONSE</code>, and global <code>PROFILE_UPDATE</code> or <code>REQUEST_PROFILE</code>.
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>Direct Message Topics</Typography>
                <CodeBlock>thatsapp/publictest/{'{recipientId}'}/messages</CodeBlock>
                <Typography variant="body2">
                  Used for direct messages between users. The <code>{'{recipientId}'}</code> should be replaced with the actual recipient&apos;s ID.
                </Typography>
              </Box>
            </TabPanel>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}