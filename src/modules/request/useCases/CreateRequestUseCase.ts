import { IRequestRepository } from '../repositories';
import { CreateRequestDTO, RequestResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { WebSocketService } from '@/shared/infra/http/express/websocket/WebSocketService';

export class CreateRequestUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(data: CreateRequestDTO): Promise<RequestResponseDTO> {
    await this.validateData(data);

    const request = await this.requestRepository.create(data);

    try {
      const webSocketService = WebSocketService.getInstance();
      await webSocketService.emitNewRequest(request);
    } catch (error) {
      console.error('❌ - Erro ao emitir nova solicitação via WebSocket:', error);
    }

    return request;
  }

  private async validateData(data: CreateRequestDTO): Promise<void> {
    if (!data.clientId || !data.providerId || !data.service_type) {
      throw new AppError({
        title: 'Dados inválidos',
        detail: 'ClientId, providerId e service_type são obrigatórios',
        origin: 'CreateRequestUseCase.execute',
        statusCode: 400,
      });
    }

    if (data.value && data.value < 0) {
      throw new AppError({
        title: 'Valor inválido',
        detail: 'O valor deve ser maior ou igual a zero',
        origin: 'CreateRequestUseCase.execute',
        statusCode: 400,
      });
    }
  }
}
