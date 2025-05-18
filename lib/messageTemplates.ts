export interface ThatsAppMessage {
  senderId: string;
  recipientId: string;
  timestamp: number;
  type: 'TEXT' | 'IMAGE' | 'LOCATION' | 'PROFILE_UPDATE' | 'REQUEST_PROFILE' | 'TYPING' | 'ONLINE_POLL' | 'ONLINE_RESPONSE';
  payload: string;
}

export const createTextMessage = (senderId: string, recipientId: string, text: string): ThatsAppMessage => ({
  senderId,
  recipientId,
  timestamp: Date.now(),
  type: 'TEXT',
  payload: text
});

export const createImageMessage = (senderId: string, recipientId: string, imageUrl: string): ThatsAppMessage => ({
  senderId,
  recipientId,
  timestamp: Date.now(),
  type: 'IMAGE',
  payload: imageUrl
});

export const createLocationMessage = (senderId: string, recipientId: string, latitude: number, longitude: number): ThatsAppMessage => ({
  senderId,
  recipientId,
  timestamp: Date.now(),
  type: 'LOCATION',
  payload: JSON.stringify({ latitude, longitude })
});

export const createProfileUpdateMessage = (senderId: string, recipientId: string, name: string, avatarUrl?: string): ThatsAppMessage => ({
  senderId,
  recipientId,
  timestamp: Date.now(),
  type: 'PROFILE_UPDATE',
  payload: JSON.stringify({ name, avatarUrl })
});

export const createRequestProfileMessage = (senderId: string, recipientId: string): ThatsAppMessage => ({
  senderId,
  recipientId,
  timestamp: Date.now(),
  type: 'REQUEST_PROFILE',
  payload: ''
});

export const createTypingMessage = (senderId: string, recipientId: string): ThatsAppMessage => ({
  senderId,
  recipientId,
  timestamp: Date.now(),
  type: 'TYPING',
  payload: ''
});

export const createOnlinePollMessage = (senderId: string, name: string, avatarUrl?: string): ThatsAppMessage => ({
  senderId,
  recipientId: '',
  timestamp: Date.now(),
  type: 'ONLINE_POLL',
  payload: JSON.stringify({ name, avatarUrl })
});

export const createOnlineResponseMessage = (senderId: string, name: string, avatarUrl?: string): ThatsAppMessage => ({
  senderId,
  recipientId: '',
  timestamp: Date.now(),
  type: 'ONLINE_RESPONSE',
  payload: JSON.stringify({ name, avatarUrl })
});