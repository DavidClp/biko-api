import { Server } from 'socket.io';

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
}
