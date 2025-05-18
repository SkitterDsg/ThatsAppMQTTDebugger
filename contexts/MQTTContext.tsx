import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// Import only on client side
import type Paho from 'paho-mqtt';

interface Message {
  topic: string;
  message: string;
  timestamp: Date;
  parsedJSON?: any;
}

interface MQTTContextType {
  client: any;
  isConnected: boolean;
  messages: Message[];
  subscribedTopics: string[];
  connect: (brokerUrl: string, options?: any) => void;
  disconnect: () => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string) => void;
  clearMessages: () => void;
}

export const MQTTContext = createContext<MQTTContextType>({
  client: null,
  isConnected: false,
  messages: [],
  subscribedTopics: [],
  connect: () => {},
  disconnect: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  publish: () => {},
  clearMessages: () => {},
});

interface MQTTProviderProps {
  children: ReactNode;
}

export const MQTTProvider: React.FC<MQTTProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Paho.Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
  const [pahoMqtt, setPahoMqtt] = useState<any>(null);

  // Load Paho MQTT client on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only in browser environment
      const loadPaho = async () => {
        try {
          const paho = await import('paho-mqtt');
          setPahoMqtt(paho);
        } catch (err) {
          console.error('Failed to load Paho MQTT client:', err);
        }
      };
      loadPaho();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        try {
          client.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
      }
    };
  }, [client]);

  const connect = (brokerUrl: string, options?: any) => {
    if (typeof window === 'undefined' || !pahoMqtt) {
      return; // Do nothing during SSR or if Paho not loaded
    }

    try {
      // Parse URL to extract host, port, and path
      let url = new URL(brokerUrl);
      
      // Remove protocol prefix (ws:// or wss://) from hostname
      const host = url.hostname;
      // Port defaults to 8000 if not provided
      const port = url.port ? parseInt(url.port) : 8000;
      // Path defaults to /mqtt if not provided
      const path = url.pathname === "/" ? "/mqtt" : url.pathname;
      
      // Generate a random client ID if not provided
      const clientId = options?.clientId || `mqttjs_${Math.random().toString(16).substring(2, 8)}`;
      
      console.log(`Connecting to ${host}:${port}${path} with client ID ${clientId}`);
      
      // Create Paho MQTT client
      const mqttClient = new pahoMqtt.Client(host, port, path, clientId);
      
      // Set callback handlers
      mqttClient.onConnectionLost = (responseObject) => {
        console.log("MQTT connection lost:", responseObject.errorMessage);
        setIsConnected(false);
      };
      
      mqttClient.onMessageArrived = (message) => {
        const topic = message.destinationName;
        const payload = message.payloadString;
        
        let parsedJSON = undefined;
        try {
          parsedJSON = JSON.parse(payload);
        } catch (e) {
          // Not JSON, which is fine
        }
        
        setMessages((prev) => [
          ...prev,
          { topic, message: payload, timestamp: new Date(), parsedJSON },
        ]);
      };
      
      // Connect to broker
      mqttClient.connect({
        onSuccess: () => {
          console.log('Connected to MQTT broker');
          setIsConnected(true);
          setClient(mqttClient);
        },
        onFailure: (error) => {
          console.error('MQTT connection failed:', error.errorMessage);
          setIsConnected(false);
        },
        useSSL: url.protocol === 'wss:',
        reconnect: true,
        timeout: 30
      });
      
    } catch (error) {
      console.error('Failed to connect to MQTT broker:', error);
    }
  };

  const disconnect = () => {
    if (client && isConnected) {
      try {
        client.disconnect();
        console.log('Disconnected from MQTT broker');
      } catch (e) {
        console.error('Error disconnecting from MQTT broker:', e);
      }
      setClient(null);
      setIsConnected(false);
      setSubscribedTopics([]);
    }
  };

  const subscribe = (topic: string) => {
    if (client && isConnected) {
      try {
        client.subscribe(topic);
        setSubscribedTopics((prev) => 
          prev.includes(topic) ? prev : [...prev, topic]
        );
      } catch (e) {
        console.error(`Error subscribing to ${topic}:`, e);
      }
    }
  };

  const unsubscribe = (topic: string) => {
    if (client && isConnected) {
      try {
        client.unsubscribe(topic);
        setSubscribedTopics((prev) => 
          prev.filter((t) => t !== topic)
        );
      } catch (e) {
        console.error(`Error unsubscribing from ${topic}:`, e);
      }
    }
  };

  const publish = (topic: string, message: string) => {
    if (client && isConnected && pahoMqtt) {
      try {
        const mqttMessage = new pahoMqtt.Message(message);
        mqttMessage.destinationName = topic;
        client.send(mqttMessage);
      } catch (e) {
        console.error(`Error publishing to ${topic}:`, e);
      }
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <MQTTContext.Provider
      value={{
        client,
        isConnected,
        messages,
        subscribedTopics,
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        publish,
        clearMessages,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
};

export const useMQTT = () => useContext(MQTTContext);