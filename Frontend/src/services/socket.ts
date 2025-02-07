import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
});

export const connectSocket = (token: string) => {
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

// Event listeners
export const onEventUpdate = (callback: (data: { eventId: string; attendeeCount: number }) => void) => {
  socket.on('eventUpdate', callback);
};

export const onJoinEvent = (callback: (data: { eventId: string; userId: string }) => void) => {
  socket.on('joinEvent', callback);
};

export const onLeaveEvent = (callback: (data: { eventId: string; userId: string }) => void) => {
  socket.on('leaveEvent', callback);
};

// Event emitters
export const emitJoinEvent = (eventId: string) => {
  socket.emit('joinEvent', { eventId });
};

export const emitLeaveEvent = (eventId: string) => {
  socket.emit('leaveEvent', { eventId });
};