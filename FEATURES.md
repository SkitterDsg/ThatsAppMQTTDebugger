# ThatsApp MQTT Debugger Features

## Connection Management
- Connect to any WebSocket MQTT broker (ws:// or wss://)
- Custom client ID support
- Connection status indication
- One-click disconnect functionality

## Topic Management
- Subscribe to multiple MQTT topics
- Support for wildcards in topic subscriptions (e.g., thatsapp/publictest/#)
- Unsubscribe from topics with a single click
- Visual indication of subscribed topics

## Message Publishing
- Publish messages to any topic
- JSON message formatting with validation
- Support for retained messages
- Pre-built message templates for ThatsApp:
  - Text messages
  - Image messages
  - Location messages
  - Profile updates
  - Profile requests
  - Typing indicators
  - Online status (poll/response)
- Template customization with sender and recipient IDs

## Message Viewing
- Real-time message display
- JSON formatting and syntax highlighting
- Topic filtering
- Duplicate message filtering
- Retained message indicators
- Timestamp display for each message
- Auto-scrolling option
- Clear message history
- Filter messages by topic

## User Interface
- Responsive design for desktop and mobile
- Dark mode support via system preferences
- Clean and intuitive layout
- Split view for controls and message display

## Technical
- Built with Next.js and React
- Uses Paho MQTT client library for WebSocket connections
- Material UI components
- TypeScript for type safety

Made with ❤️ by Doruk for FHNW EMOBA module