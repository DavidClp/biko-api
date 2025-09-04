import { Server } from 'socket.io';
import { ChatSocketHandler } from './ChatSocketHandler';

export function setupWebSocket(io: Server) {
    new ChatSocketHandler(io);
    console.log('✅ WebSocket configurado com sucesso');
}
