import { Socket, Server } from 'socket.io';

export class RequestSocketController {
    private socket: Socket;
    private io: Server;
    private userId: string;

    constructor(socket: Socket, io: Server, userId: string) {
        this.socket = socket;
        this.io = io;
        this.userId = userId;
    }

    async handleSubscribeToRequests({ providerId }: { providerId: string }) {
        if (!providerId) {
            this.socket.emit("request:error", {
                message: "Provider ID é obrigatório"
            });
            return;
        }

        try {
            // Adicionar o usuário a uma sala específica para o provider
            this.socket.join(`provider:${providerId}`);

            console.log(`provider ${providerId} se inscreveu para receber solicitações`);
            
        } catch (error) {
            console.error("❌ - Erro ao se inscrever nas solicitações:", error);
            this.socket.emit("request:error", {
                message: "Erro ao se inscrever nas solicitações"
            });
        }
    }

    async handleUnsubscribeFromRequests({ providerId }: { providerId: string }) {
        if (!providerId) return;

        try {
            this.socket.leave(`provider:${providerId}`);
            console.log(`provider ${providerId} se desinscreveu das solicitações`);
            
        } catch (error) {
            console.error("❌ - Erro ao se desinscrever das solicitações:", error);
        }
    }

    // Método para emitir nova solicitação (chamado quando uma solicitação é criada)
    async emitNewRequest(requestData: any) {
        try {
            // Emitir para todos os usuários conectados do provider específico
            this.io.to(`provider:${requestData.providerId}`).emit("request:new", requestData);
            console.log(`✅ - Nova solicitação emitida para provider ${requestData.providerId}`);
                
        } catch (error) {
            console.error("❌ - Erro ao emitir nova solicitação:", error);
        }
    }

    handleDisconnect() {
        console.log(`User ${this.userId} desconectado do RequestController`);
    }
}