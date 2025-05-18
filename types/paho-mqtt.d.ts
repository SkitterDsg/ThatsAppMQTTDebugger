declare module 'paho-mqtt' {
  export class Client {
    constructor(host: string, port: number, path: string, clientId: string);
    connect(options: {
      onSuccess?: () => void;
      onFailure?: (error: { errorMessage: string }) => void;
      useSSL?: boolean;
      userName?: string;
      password?: string;
      reconnect?: boolean;
      timeout?: number;
    }): void;
    subscribe(topic: string, options?: { qos?: number }): void;
    unsubscribe(topic: string, options?: object): void;
    send(message: Message): void;
    disconnect(): void;
    onConnectionLost: (responseObject: { errorMessage: string }) => void;
    onMessageArrived: (message: Message) => void;
  }

  export class Message {
    constructor(payload: string);
    destinationName: string;
    duplicate: boolean;
    payloadBytes: Uint8Array;
    payloadString: string;
    qos: number;
    retained: boolean;
    topic: string;
  }
}