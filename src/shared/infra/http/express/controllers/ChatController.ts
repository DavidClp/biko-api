import { Socket, Server } from 'socket.io';
import { database } from "../../../database";
import { MessageType, RequestBudgetStatus } from '@prisma/client';

interface UserPresence {
    userId: string;
    isOnline: boolean;
    lastSeen: Date;
    currentRoom?: string;
}

interface TypingUser {
    userId: string;
    userName: string;
    requestId: string;
}

export class ChatController {
    private socket: Socket;
    private io: Server;
    private userId: string;
    private static onlineUsers = new Map<string, UserPresence>();
    private static typingUsers = new Map<string, TypingUser>();

    constructor(socket: Socket, io: Server, userId: string) {
        this.socket = socket;
        this.io = io;
        this.userId = userId;
    }

    // Gerenciar presença do usuário
    async handleUserOnline() {
        try {
            const user = await database.user.findUnique({
                where: { id: this.userId },
                select: {
                    id: true,
                    provider: {
                        select: {
                            name: true
                        }
                    },
                    client: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            if (!user) {
                this.socket.emit("chat:error", { message: "Usuário não encontrado" });
                return;
            }

            // Adicionar usuário aos online
            ChatController.onlineUsers.set(this.userId, {
                userId: this.userId,
                isOnline: true,
                lastSeen: new Date(),
                currentRoom: undefined
            });

            const userName = user.provider?.name || user.client?.name || '';

            // Notificar todos os usuários sobre a presença
            this.io.emit("user:online", {
                userId: this.userId,
                userName: userName,
                isOnline: true,
                lastSeen: new Date()
            });

            console.log(`✅ - Usuário ${userName} (${this.userId}) está online`);
            console.log(`📤 - Evento user:online emitido para todos os usuários`);
        } catch (error) {
            console.error("❌ - Erro ao definir usuário como online:", error);
        }
    }

    async handleUserOffline() {
        try {
            const userPresence = ChatController.onlineUsers.get(this.userId);
            if (userPresence) {
                ChatController.onlineUsers.set(this.userId, {
                    ...userPresence,
                    isOnline: false,
                    lastSeen: new Date()
                });

                // Notificar todos os usuários sobre a presença
                this.io.emit("user:offline", {
                    userId: this.userId,
                    isOnline: false,
                    lastSeen: new Date()
                });

                console.log(`✅ - Usuário ${this.userId} está offline`);
                console.log(`📤 - Evento user:offline emitido para todos os usuários`);
            }
        } catch (error) {
            console.error("❌ - Erro ao definir usuário como offline:", error);
        }
    }

    // Entrar em uma sala de chat
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
                orderBy: { createdAt: 'desc' },
                take: 50,
                select: {
                    id: true,
                    content: true,
                    sender_id: true,
                    receiver_id: true,
                    createdAt: true,
                    type: true,
                    viewed: true,
                    request_id: true,
                }
            });

            // Atualizar presença do usuário
            const userPresence = ChatController.onlineUsers.get(this.userId);
            if (userPresence) {
                ChatController.onlineUsers.set(this.userId, {
                    ...userPresence,
                    currentRoom: requestId
                });
            }

            // Entrar na sala
            this.socket.join(requestId);
            this.socket.join(`user:${this.userId}`); // Sala pessoal para notificações

            console.log(`✅ - Usuário ${this.userId} entrou na sala ${requestId}`);

            // Enviar mensagens para o usuário
            this.socket.emit("chat:load_messages", {
                messages: messages.reverse(), // Reverter para ordem cronológica
                requestId,
                hasMore: messages.length === 50
            });

            // Marcar mensagens não lidas como visualizadas
            await this.markUnreadMessagesAsViewed(requestId);

            // Notificar outros usuários na sala sobre a presença
            this.socket.to(requestId).emit("user:joined_room", {
                userId: this.userId,
                requestId
            });

        } catch (error) {
            console.error("❌ - Erro ao entrar na sala:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao entrar na sala"
            });
        }
    }

    // Sair de uma sala
    async handleLeaveRoom({ requestId }: { requestId: string }) {
        try {
            this.socket.leave(requestId);

            // Atualizar presença do usuário
            const userPresence = ChatController.onlineUsers.get(this.userId);
            if (userPresence) {
                ChatController.onlineUsers.set(this.userId, {
                    ...userPresence,
                    currentRoom: undefined
                });
            }

            // Notificar outros usuários na sala
            this.socket.to(requestId).emit("user:left_room", {
                userId: this.userId,
                requestId
            });

            console.log(`✅ - Usuário ${this.userId} saiu da sala ${requestId}`);
        } catch (error) {
            console.error("❌ - Erro ao sair da sala:", error);
        }
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
                // marcar as propostas antigas como rejeitadas
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

            console.log(`✅ - Mensagem criada: ${message.id}`);

            // Emitir para todos na sala
            this.io.to(requestId).emit("chat:new_message", message);

            // Emitir notificação para o receptor (sempre, para garantir que receba)
            this.io.to(`user:${toUserId}`).emit("chat:notification", {
                message,
                requestId,
                senderId: this.userId
            });

            console.log(`🔔 Notificação enviada para usuário: ${toUserId}`);

            //this.handleStopTyping({ requestId });

        } catch (error) {
            console.error("❌ - Erro ao enviar mensagem:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao enviar mensagem"
            });
        }
    }

    // Marcar mensagens como visualizadas
    async handleMarkAsViewed({ messageIds, requestId }: {
        messageIds: string[],
        requestId: string
    }) {
        try {
            console.log(`📥 [${requestId}] Recebido evento para marcar ${messageIds?.length || 0} mensagens como visualizadas`);

            if (!messageIds?.length) {
                console.log("⚠️ - Nenhuma mensagem para marcar como visualizada");
                return;
            }

            // Atualizar mensagens como visualizadas
            const result = await database.message.updateMany({
                where: {
                    id: { in: messageIds },
                    receiver_id: this.userId,
                    viewed: false
                },
                data: { viewed: true }
            });

            console.log(`✅ - ${result.count} mensagens atualizadas no banco de dados`);

            // Notificar o remetente sobre as mensagens visualizadas
            const messages = await database.message.findMany({
                where: { id: { in: messageIds } },
                select: { sender_id: true, id: true }
            });

            const senderIds = [...new Set(messages.map(m => m.sender_id))];

            senderIds.forEach(senderId => {
                this.io.to(`user:${senderId}`).emit("chat:messages_viewed", {
                    messageIds: messages.filter(m => m.sender_id === senderId).map(m => m.id),
                    requestId,
                    viewedBy: this.userId
                });
            });

            console.log(`✅ - Notificações enviadas para ${senderIds.length} remetentes`);

        } catch (error) {
            console.error("❌ - Erro ao marcar mensagens como visualizadas:", error);
        }
    }

    // Indicador de digitação
    async handleStartTyping({ requestId, userName }: { requestId: string, userName: string }) {
        try {
            ChatController.typingUsers.set(this.userId, {
                userId: this.userId,
                userName,
                requestId
            });

            this.socket.to(requestId).emit("chat:typing_start", {
                userId: this.userId,
                userName,
                requestId
            });

        } catch (error) {
            console.error("❌ - Erro ao iniciar indicador de digitação:", error);
        }
    }

    async handleStopTyping({ requestId }: { requestId: string }) {
        try {
            ChatController.typingUsers.delete(this.userId);

            this.socket.to(requestId).emit("chat:typing_stop", {
                userId: this.userId,
                requestId
            });

        } catch (error) {
            console.error("❌ - Erro ao parar indicador de digitação:", error);
        }
    }

    // Carregar mais mensagens (paginação)
    async handleLoadMoreMessages({ requestId, lastMessageId }: {
        requestId: string,
        lastMessageId?: string
    }) {
        try {
            const messages = await database.message.findMany({
                where: {
                    request_id: requestId,
                    ...(lastMessageId && { id: { lt: lastMessageId } })
                },
                orderBy: { createdAt: 'desc' },
                take: 50,
                select: {
                    id: true,
                    content: true,
                    sender_id: true,
                    receiver_id: true,
                    createdAt: true,
                    type: true,
                    viewed: true,
                    request_id: true,
                }
            });

            this.socket.emit("chat:more_messages", {
                messages: messages.reverse(),
                hasMore: messages.length === 50,
                requestId
            });

        } catch (error) {
            console.error("❌ - Erro ao carregar mais mensagens:", error);
            this.socket.emit("chat:error", {
                message: "Erro ao carregar mensagens"
            });
        }
    }

    // Obter usuários online
    async handleGetOnlineUsers() {
        try {
            const onlineUsers = Array.from(ChatController.onlineUsers.values())
                .filter(user => user.isOnline);

            this.socket.emit("chat:online_users", onlineUsers);
        } catch (error) {
            console.error("❌ - Erro ao obter usuários online:", error);
        }
    }

    // Obter usuários digitando
    async handleGetTypingUsers({ requestId }: { requestId: string }) {
        try {
            const typingUsers = Array.from(ChatController.typingUsers.values())
                .filter(user => user.requestId === requestId && user.userId !== this.userId);

            this.socket.emit("chat:typing_users", {
                requestId,
                users: typingUsers
            });
        } catch (error) {
            console.error("❌ - Erro ao obter usuários digitando:", error);
        }
    }

    // Desconexão
    handleDisconnect() {
        try {
            // Marcar usuário como offline
            this.handleUserOffline();

            // Remover de todas as salas de digitação
            ChatController.typingUsers.delete(this.userId);

            // Remover da lista de usuários online
            ChatController.onlineUsers.delete(this.userId);

            console.log(`✅ - Usuário ${this.userId} desconectado`);
        } catch (error) {
            console.error("❌ - Erro ao desconectar usuário:", error);
        }
    }

    // Métodos estáticos para acesso externo
    static getOnlineUsers(): UserPresence[] {
        return Array.from(ChatController.onlineUsers.values())
            .filter(user => user.isOnline);
    }

    static isUserOnline(userId: string): boolean {
        const user = ChatController.onlineUsers.get(userId);
        return user?.isOnline || false;
    }

    static getTypingUsers(requestId: string): TypingUser[] {
        return Array.from(ChatController.typingUsers.values())
            .filter(user => user.requestId === requestId);
    }

    // Método privado para marcar mensagens não lidas como visualizadas
    private async markUnreadMessagesAsViewed(requestId: string) {
        try {
            // Buscar mensagens não lidas destinadas ao usuário atual
            const unreadMessages = await database.message.findMany({
                where: {
                    request_id: requestId,
                    receiver_id: this.userId,
                    viewed: false,
                    NOT: { sender_id: this.userId } // Não marcar mensagens enviadas pelo próprio usuário
                },
                select: { id: true }
            });

            if (unreadMessages.length > 0) {
                const messageIds = unreadMessages.map(msg => msg.id);

                // Marcar como visualizadas
                await database.message.updateMany({
                    where: { id: { in: messageIds } },
                    data: { viewed: true }
                });

                // Notificar o remetente sobre as mensagens visualizadas
                const messages = await database.message.findMany({
                    where: { id: { in: messageIds } },
                    select: { sender_id: true, id: true }
                });

                const senderIds = [...new Set(messages.map(m => m.sender_id))];

                senderIds.forEach(senderId => {
                    this.io.to(`user:${senderId}`).emit("chat:messages_viewed", {
                        messageIds: messages.filter(m => m.sender_id === senderId).map(m => m.id),
                        requestId,
                        viewedBy: this.userId
                    });
                });

                console.log(`✅ - ${messageIds.length} mensagens marcadas como visualizadas para o usuário ${this.userId}`);
            }
        } catch (error) {
            console.error("❌ - Erro ao marcar mensagens como visualizadas:", error);
        }
    }
}