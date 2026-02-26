import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const setIO = (socketIO: SocketIOServer) => {
  io = socketIO;
};

export const getIO = () => io;
