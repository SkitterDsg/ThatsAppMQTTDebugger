# ThatsApp MQTT Debugger

A real-time MQTT client debugger for ThatsApp, built with Next.js and deployable to Vercel. This tool helps you debug MQTT messages by allowing you to:

- Connect to MQTT brokers (default: broker.hivemq.com:1883)
- Subscribe to topics (including wildcards)
- Monitor incoming messages in real-time
- Publish test messages with a built-in message formatter
- Generate ThatsApp-specific message templates

## Features

- **Real-time MQTT Connection**: Connect to any MQTT broker over WebSockets
- **Topic Subscription**: Subscribe to multiple topics with wildcard support
- **Message Monitoring**: View all incoming messages with timestamps and formatted JSON
- **Message Publishing**: Send test messages to any topic
- **ThatsApp Templates**: Generate properly formatted ThatsApp messages
- **Responsive UI**: Works on desktop and mobile devices

## Getting Started

### Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Usage

1. **Connect to MQTT Broker**:
   - Enter the broker URL (e.g., `mqtt://broker.hivemq.com:1883` for regular MQTT or `ws://broker.hivemq.com:8000/mqtt` for WebSockets)
   - Click "Connect"

2. **Subscribe to Topics**:
   - Enter a topic to subscribe (e.g., `thatsapp/publictest/#` to subscribe to all ThatsApp messages)
   - Click "Subscribe"

3. **View Messages**:
   - All incoming messages will appear in the Messages panel
   - Messages are shown with topic, timestamp, and formatted content
   - Use the filter to focus on specific topics

4. **Publish Messages**:
   - Enter the topic to publish to
   - Create a message using templates or write your own
   - Click "Publish"

## ThatsApp Message Format

This debugger supports all ThatsApp message types:

- TEXT
- IMAGE
- LOCATION
- PROFILE_UPDATE
- REQUEST_PROFILE
- TYPING
- ONLINE_POLL
- ONLINE_RESPONSE

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.