import { Server } from 'socket.io';
import { ChatSocketHandler } from './ChatSocketHandler';
import { WebSocketService } from './WebSocketService';

export function setupWebSocket(io: Server) {
    // Inicializar o serviço de WebSocket
    WebSocketService.initialize(io);
    
    // Configurar handlers de conexão
    new ChatSocketHandler(io);
    console.log('✅ WebSocket configurado com sucesso');
}
