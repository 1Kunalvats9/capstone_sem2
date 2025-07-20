import { io } from 'socket.io-client';

let socket;

export const initSocketClient = () => {
  if (!socket) {
    socket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    });
  }
  return socket;
};

export const getSocketClient = () => {
  if (!socket) {
    return initSocketClient();
  }
  return socket;
};