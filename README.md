# ThatsApp MQTT Debugger

A feature-rich MQTT debugging tool designed specifically for ThatsApp messaging protocol development and testing. This web-based application allows you to easily connect to MQTT brokers, subscribe to topics, publish messages, and monitor real-time communication.

## 🚀 Features

- **Connect to any MQTT broker** with WebSocket support (ws:// or wss://)
- **Subscribe to multiple topics** with support for wildcards
- **Publish messages** with customizable payload and retained flag
- **Real-time message viewing** with auto-formatting for JSON payloads
- **Message filtering** by topic and duplicate detection
- **ThatsApp message templates** for quick testing of various message types:
  - Text messages
  - Image messages
  - Location sharing
  - Profile updates
  - Typing indicators
  - Online status
- **Retained message** support for both publishing and viewing
- **Responsive design** that works on desktop and mobile devices

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/thatsapp-mqtt-debugger.git

# Navigate to the project directory
cd thatsapp-mqtt-debugger

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📋 Usage

1. **Connect to an MQTT broker**:
   - Enter the WebSocket URL of your MQTT broker (e.g., `ws://broker.hivemq.com:8000/mqtt`)
   - Provide a client ID or use the auto-generated one
   - Click "Connect"

2. **Subscribe to topics**:
   - Enter a topic pattern (e.g., `thatsapp/publictest/#`)
   - Click "Subscribe"
   - You can subscribe to multiple topics

3. **Publish messages**:
   - Enter a topic to publish to
   - Type a message or use the ThatsApp message templates
   - Toggle "Retained" if you want the message to be stored on the broker
   - Click "Publish"

4. **View messages**:
   - All received messages appear in the message viewer panel
   - Filter messages by topic using the filter input
   - Toggle "Auto-scroll" to automatically scroll to new messages
   - Toggle "Filter duplicates" to hide duplicate messages

## 💻 Development

The project is built with:

- **Next.js** - React framework for web applications
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material UI** - Component library
- **Paho MQTT** - MQTT client library for browser

### Project Structure

```
/
├── components/          # React components
│   ├── ConnectionForm.tsx
│   ├── MessagePublisher.tsx
│   ├── MessageViewer.tsx
│   └── TopicSubscriber.tsx
├── contexts/            # React contexts
│   └── MQTTContext.tsx  # MQTT client management
├── lib/                 # Utility functions
│   └── messageTemplates.ts
├── pages/               # Next.js pages
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx        # Main application page
├── public/              # Static assets
├── styles/              # CSS styles
└── types/               # TypeScript type definitions
```

### Deployment to Vercel

The easiest way to deploy this app is using Vercel:

1. Fork this repository to your GitHub account
2. Sign up for a [Vercel account](https://vercel.com/signup) if you don't have one
3. Create a new project in Vercel and import your forked repository
4. Deploy the project

Alternatively, you can use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## 📱 ThatsApp Message Protocol

ThatsApp uses a simple JSON message format for communication:

```typescript
interface ThatsAppMessage {
  senderId: string;      // Unique ID of the sender
  recipientId: string;   // Unique ID of the recipient (empty for global messages)
  timestamp: number;     // Message timestamp in milliseconds
  type: string;          // Message type (TEXT, IMAGE, LOCATION, etc.)
  payload: string;       // Message content (format depends on type)
}
```

This debugger supports all ThatsApp message types:

- TEXT
- IMAGE
- LOCATION
- PROFILE_UPDATE
- REQUEST_PROFILE
- TYPING
- ONLINE_POLL
- ONLINE_RESPONSE

## 🔒 Security Considerations

- The app runs entirely in your browser and does not store any data on a server
- Your MQTT connection details and messages are not saved between sessions
- When using the tool on an HTTPS page, it will automatically upgrade insecure WebSocket connections to secure ones (WSS)

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❤️ Acknowledgements

Made with ❤️ by Doruk for FHNW EMOBA module