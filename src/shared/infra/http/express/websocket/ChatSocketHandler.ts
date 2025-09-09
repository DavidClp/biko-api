import { Server, Socket } from 'socket.io';
import { ChatController } from '../controllers/ChatController';
import { RequestSocketController } from '../controllers/RequestController';

export class ChatSocketHandler {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.setupSocketAuth();
        this.setupConnectionHandler();
    }

    private setupSocketAuth() {
        this.io.use((socket, next) => {
            const userId = socket.handshake.auth?.userId;
            console.log('Usuário tentando conectar:', userId);

            if (!userId) {
                return next(new Error("Unauthorized"));
            }

            (socket as any).userId = userId;
            next();
        });
    }

    private setupConnectionHandler() {
        this.io.on("connection", (socket: Socket) => {
            const userId = (socket as any)?.userId;
            console.log(`User ${userId} conectado`);

            const chatController = new ChatController(socket, this.io, userId);
            const requestController = new RequestSocketController(socket, this.io, userId);

            // Eventos do chat
            socket.on("chat:join", (data) => chatController.handleJoinRoom(data));
            socket.on("chat:send", (data) => chatController.handleSendMessage(data));
            socket.on("chat:viewed", (data) => chatController.handleMarkAsViewed(data));

            socket.on("request:subscribe-provider", (data) => requestController.handleSubscribeToRequests(data));
            socket.on("request:unsubscribe-provider", (data) => requestController.handleUnsubscribeFromRequests(data));

            // Evento de desconexão
            socket.on("disconnect", () => chatController.handleDisconnect());
        });
    }
}
