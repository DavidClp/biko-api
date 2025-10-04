import { RequestRepository } from '../../request/repositories/RequestRepository';

export class CheckUserPermissionForRequestUseCase {
  constructor(private requestRepository: RequestRepository) {}

  async execute(userId: string, requestId: string): Promise<boolean> {
    try {
      const request = await this.requestRepository.findById(requestId);
      
      if (!request) {
        return false;
      }

      // Verificar se o usuário é o cliente ou o prestador da solicitação
      const isClient = request.client?.userId === userId;
      const isProvider = request.provider?.userId === userId;

      return isClient || isProvider;
    } catch (error) {
      return false;
    }
  }
}
