import { Socket, Server } from 'socket.io';
import { database } from "../../../database";
import { MessageType, RequestBudgetStatus } from '@prisma/client';

// Versão debug do ChatController para investigar problema de WebSocket
export class ChatControllerDebug {
    private socket: Socket;
    private io: Server;
    private userId: string;

    constructor(socket: Socket, io: Server, userId: string) {
        this.socket = socket;
        this.io = io;
        this.userId = userId;
    }

    async handleSendMessage({ requestId, content, toUserId, providerId, type }: {
        requestId: string;
        content: string;
        toUserId: string;
        providerId: string;
        type: MessageType;
    }) {
        if (!content?.trim()) {
            this.socket.emit("chat:error", { message: "Conteúdo da mensagem é obrigatório" });
            return;
        }

        try {
            if (type === MessageType.PROPOSAL) {
                await database.message.updateMany({
                    where: { request_id: requestId, type: MessageType.PROPOSAL },
                    data: { type: MessageType.PROPOSAL_REJECTED }
                });
            }

            const message = await database.message.create({
                data: {
                    request_id: requestId,
                    content: content.trim(),
                    sender_id: this.userId,
                    receiver_id: toUserId,
                    viewed: false,
                    type: type || 'TEXT'
                },
                select: {
                    id: true,
                    content: true,
                    sender_id: true,
                    receiver_id: true,
                    createdAt: true,
                    viewed: true,
                    request_id: true,
                    type: true,
                }
            });


            // Emitir para todos na sala
            this.io.to(requestId).emit("chat:new_message", message);

            // Emitir notificação para o receptor
            this.io.to(`user:${toUserId}`).emit("chat:notification", {
                message,
                requestId,
                senderId: this.userId
            });
        } catch (error) {
            console.error("❌ DEBUG: Erro ao enviar mensagem:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao enviar mensagem"
            });
        }
    }
}
