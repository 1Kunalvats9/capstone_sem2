import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-property', (propertyId) => {
        socket.join(`property-${propertyId}`);
        console.log(`User ${socket.id} joined property ${propertyId}`);
      });

      socket.on('leave-property', (propertyId) => {
        socket.leave(`property-${propertyId}`);
        console.log(`User ${socket.id} left property ${propertyId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};