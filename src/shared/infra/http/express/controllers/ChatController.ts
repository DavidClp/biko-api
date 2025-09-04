import { Socket, Server } from 'socket.io';
import { database } from "../../../database";

export class ChatController {
    private socket: Socket;
    private io: Server;
    private userId: string;

    constructor(socket: Socket, io: Server, userId: string) {
        this.socket = socket;
        this.io = io;
        this.userId = userId;
    }

    async handleJoinRoom({ requestId }: { requestId: string }) {
        console.log("requestId", requestId);

        if (!requestId) {
            this.socket.emit("chat:error", {
                message: "Request ID é obrigatório"
            });
            return;
        }

        try {
            const request = await database.request.findUnique({ 
                where: { id: requestId } 
            });
            
            if (!request) {
                console.log(`❌ - Request ${requestId} não encontrado`);
                this.socket.emit("chat:error", {
                    message: "Request não encontrado"
                });
                return;
            }
            
            const messages = await database.message.findMany({
                where: { request_id: requestId },
                orderBy: { createdAt: 'asc' }
            });
            
            this.socket.join(requestId);
            console.log(`User ${this.userId} entrou na sala ${requestId}`);
            console.log(`��� - Enviando ${messages.length} mensagens para o usuário`);
            
            this.socket.emit("chat:load_messages", {
                messages,
                requestId
            });
            
        } catch (error) {
            console.error("❌ - Erro ao entrar na sala:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao entrar na sala"
            });
        }
    }

    async handleSendMessage({ requestId, content, toUserId }: { 
        requestId: string; 
        content: string; 
        toUserId: string; 
    }) {
        
        try {
            const msg = await database.message.create({
                data: {
                    request_id: requestId,
                    content,
                    sender_id: this.userId,
                    receiver_id: toUserId,
                },
            });

            console.log(`✅ - Mensagem criada com sucesso: ${msg.id}`);
            this.io.to(requestId).emit("chat:new_message", msg);
        } catch (error) {
            console.error("❌ - Erro ao enviar mensagem:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao enviar mensagem"
            });
        }
    }

    async handleMarkAsViewed({ messageId }: { messageId: string }) {
        try {
            const msg = await database.message.update({
                where: { id: messageId },
                data: { viewed: true },
            });

            console.log(`✅ - Mensagem marcada como lida: ${msg.id}`);
            this.io.to(msg.request_id).emit("chat:message_viewed", msg);
        } catch (error) {
            console.error("❌ - Erro ao marcar mensagem como lida:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao marcar mensagem como lida"
            });
        }
    }

    handleDisconnect() {
        console.log(`User ${this.userId} desconectado`);
    }
}
