# ThatsApp MQTT Debugger - Usage Guide

ThatsApp MQTT Debugger is a web-based tool designed to help you debug and test MQTT communications for the ThatsApp project. This guide explains how to use the debugger effectively.

## Getting Started

1. **Access the Debugger**
   - You can access the hosted version at: [Your Vercel URL]
   - Alternatively, you can run it locally:
     ```
     npm install
     npm run dev
     ```

2. **Connect to MQTT Broker**
   - Enter the broker URL (e.g., `ws://broker.hivemq.com:8000/mqtt`)
   - Provide a client ID (or use the auto-generated one)
   - Click "Connect"

## Working with MQTT Topics

1. **Subscribe to Topics**
   - Enter a topic to subscribe (e.g., `thatsapp/publictest/#` for all ThatsApp messages)
   - Click "Subscribe"
   - You can subscribe to multiple topics
   - Click the (X) on a topic chip to unsubscribe

2. **View Messages**
   - All received messages appear in the Messages panel
   - They are sorted chronologically with the newest at the bottom
   - JSON messages are automatically formatted and displayed
   - You can filter messages by topic

## Sending Test Messages

1. **Publish Basic Messages**
   - Enter a topic (e.g., `thatsapp/publictest/recipient/messages`)
   - Enter your message content
   - Click "Publish"

2. **Working with JSON Messages**
   - Ensure "Format as JSON" is enabled (on by default)
   - Enter valid JSON or use the templates
   - Invalid JSON will show an error

3. **Using ThatsApp Templates**
   - Select a message type from the dropdown
   - Enter sender and recipient IDs
   - Click "Create Template"
   - The tool will generate a valid ThatsApp message
   - Modify as needed
   - Click "Publish"

## ThatsApp Message Types

ThatsApp supports several message types that you can test:

1. **TEXT**: Simple text messages
2. **IMAGE**: URLs to images
3. **LOCATION**: GPS coordinates
4. **PROFILE_UPDATE**: Update user profile
5. **REQUEST_PROFILE**: Request user profile
6. **TYPING**: Indicate user is typing
7. **ONLINE_POLL**: Poll for online users
8. **ONLINE_RESPONSE**: Response to online polls

## Topic Structure

ThatsApp uses this topic structure:

- Individual messages: `thatsapp/publictest/{recipientId}/messages`
- Global messages: `thatsapp/publictest/global`

## Troubleshooting

- If connection fails, check that:
  - Your broker URL uses WebSocket (ws:// or wss://)
  - Your broker accepts WebSocket connections
  - You're using the correct port (typically 8000 or 8080 for WebSockets)
  
- If messages don't appear:
  - Check that you've subscribed to the right topics
  - Ensure your topic patterns match the published topics

## Tips for Testing ThatsApp

1. Subscribe to `thatsapp/publictest/#` to see all messages in the system
2. To test direct messages, use your app's user ID as the recipient
3. To test online detection, send ONLINE_POLL messages to the global topic

Happy debugging!