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
        if (!requestId) {
            this.socket.emit("chat:error", {
                message: "Request ID é obrigatório"
            });
            return;
        }

        try {
            const messages = await database.message.findMany({
                where: { request_id: requestId },
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    content: true,
                    sender_id: true,
                    createdAt: true,
                    request_id: true,
                }
            });
            
            this.socket.join(requestId);
            console.log(`User ${this.userId} entrou na sala ${requestId}`);
           // console.log(`��� - Enviando ${messages.length} mensagens para o usuário`);
            
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

    async handleSendMessage({ requestId, content, toUserId, providerId }: { 
        requestId: string; 
        content: string; 
        toUserId: string; 
        providerId: string;
    }) {
        
        try {
            const msg = await database.message.create({
                data: {
                    request_id: requestId,
                    content,
                    sender_id: this.userId,
                    receiver_id: toUserId,
                },
                select: {
                    id: true,
                    content: true,
                    sender_id: true,
                    createdAt: true,
                    request_id: true,
                }
            });

            console.log(`✅ - Mensagem criada com sucesso: ${msg.id}`);
            this.io.to(requestId).emit("chat:new_message", msg);

            // envia para o provider em toda a aplicação
            this.io.to(`provider:${providerId}`).emit("chat:new_message", msg);
        } catch (error) {
            console.error("❌ - Erro ao enviar mensagem:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao enviar mensagem"
            });
        }
    }

    async handleMarkAsViewed({ receiverId, requestId }: { receiverId: string, requestId: string }) {
        try {
            console.log(`✅ - Marcando mensagem como lida para o request e receiver: ${requestId} e ${receiverId}`);
            const msg = await database.message.updateMany({
                where: { receiver_id: receiverId },
                data: { viewed: true },
            });

            console.log(`✅ - Mensagem marcada como lida para o request e receiver: ${requestId} e ${receiverId}`);
            this.io.to(requestId).emit("chat:message_viewed", msg);
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
