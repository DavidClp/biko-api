import { Server } from 'socket.io';
import { ChatController } from '../controllers/ChatController';

interface OnlineUser {
    userId: string;
    userName: string;
    isOnline: boolean;
    lastSeen: Date;
    currentRoom?: string;
}

interface TypingUser {
    userId: string;
    userName: string;
    requestId: string;
}

export class WebSocketService {
    private static io: Server;

    static initialize(io: Server) {
        this.io = io;
        console.log('✅ WebSocketService inicializado');
    }

    static getInstance(): WebSocketService {
        if (!this.io) {
            throw new Error('WebSocketService não foi inicializado. Chame initialize() primeiro.');
        }
        return new WebSocketService();
    }

    // Emitir nova solicitação para todos os usuários conectados de um provider específico
    async emitNewRequest(requestData: any) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            // Emitir para todos os usuários conectados do provider específico
            WebSocketService.io.to(`provider:${requestData.providerId}`).emit("request:new", requestData);
            console.log(`✅ - Nova solicitação emitida para provider ${requestData.providerId}`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir nova solicitação:', error);
        }
    }

    // Emitir atualização de status de solicitação
    async emitRequestStatusUpdate(requestData: any) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            // Emitir para todos os usuários conectados do provider específico
            WebSocketService.io.to(`provider:${requestData.providerId}`).emit("request:status_update", requestData);
            console.log(`✅ - Atualização de status emitida para provider ${requestData.providerId}`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir atualização de status:', error);
        }
    }

    // Emitir mensagem para um usuário específico
    async emitToUser(userId: string, event: string, data: any) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            WebSocketService.io.to(`user:${userId}`).emit(event, data);
            console.log(`✅ - Mensagem ${event} emitida para usuário ${userId}`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir mensagem para usuário:', error);
        }
    }

    // Emitir para todos os usuários conectados
    async emitToAll(event: string, data: any) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            WebSocketService.io.emit(event, data);
            console.log(`✅ - Mensagem ${event} emitida para todos os usuários`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir mensagem para todos:', error);
        }
    }

    // Emitir para uma sala específica
    async emitToRoom(roomId: string, event: string, data: any) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            WebSocketService.io.to(roomId).emit(event, data);
            console.log(`✅ - Mensagem ${event} emitida para sala ${roomId}`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir mensagem para sala:', error);
        }
    }

    // Emitir nova mensagem de chat
    async emitNewMessage(message: any, requestId: string, providerId: string) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            // Emitir para todos na sala do chat
            WebSocketService.io.to(requestId).emit("chat:new_message", message);

            // Emitir notificação para o receptor (se não estiver na sala)
            WebSocketService.io.to(`user:${message.receiver_id}`).emit("chat:notification", {
                message,
                requestId,
                senderId: message.sender_id
            });

            // Emitir para o provider em toda a aplicação
            WebSocketService.io.to(`provider:${providerId}`).emit("chat:new_message", message);

            console.log(`✅ - Nova mensagem emitida: ${message.id}`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir nova mensagem:', error);
        }
    }

    // Emitir atualização de presença
    async emitPresenceUpdate(userId: string, isOnline: boolean, userName?: string) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            const event = isOnline ? "user:online" : "user:offline";
            const data = {
                userId,
                userName,
                isOnline,
                lastSeen: new Date()
            };

            WebSocketService.io.emit(event, data);
            console.log(`✅ - Presença atualizada: ${userId} está ${isOnline ? 'online' : 'offline'}`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir atualização de presença:', error);
        }
    }

    // Emitir indicador de digitação
    async emitTypingIndicator(requestId: string, userId: string, userName: string, isTyping: boolean) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            const event = isTyping ? "chat:typing_start" : "chat:typing_stop";
            const data = {
                userId,
                userName,
                requestId
            };

            WebSocketService.io.to(requestId).emit(event, data);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir indicador de digitação:', error);
        }
    }

    async emitMessagesViewed(messageIds: string[], requestId: string, viewedBy: string) {
        try {
            if (!WebSocketService.io) {
                console.error('❌ - WebSocketService.io não está disponível');
                return;
            }

            const senderIds = await this.getSenderIds(messageIds);
            
            senderIds.forEach(senderId => {
                WebSocketService.io.to(`user:${senderId}`).emit("chat:messages_viewed", {
                    messageIds: messageIds.filter((_, index) => senderIds[index] === senderId),
                    requestId,
                    viewedBy
                });
            });

            console.log(`✅ - Mensagens visualizadas emitidas: ${messageIds.length}`);
            
        } catch (error) {
            console.error('❌ - Erro ao emitir mensagens visualizadas:', error);
        }
    }

    // Obter usuários online
    getOnlineUsers(): OnlineUser[] {
        return ChatController.getOnlineUsers() as OnlineUser[];
    }

    // Verificar se usuário está online
    isUserOnline(userId: string) {
        return ChatController.isUserOnline(userId);
    }

    // Obter usuários digitando em uma sala
    getTypingUsers(requestId: string): TypingUser[] {
        return ChatController.getTypingUsers(requestId);
    }

    // Método auxiliar para obter sender IDs das mensagens
    private async getSenderIds(messageIds: string[]): Promise<string[]> {
        // Esta implementação precisaria acessar o banco de dados
        // Por simplicidade, retornamos um array vazio
        // Em uma implementação real, você faria uma query no banco
        return [];
    }
}
