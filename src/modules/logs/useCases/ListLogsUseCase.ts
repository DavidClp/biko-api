import { LogRepository } from '../repositories/LogRepository';
import { ListLogsDTO, ListLogsResult } from '../dtos/ListLogsDTO';

export class ListLogsUseCase {
  constructor(private logRepository: LogRepository) {}

  async execute(params: ListLogsDTO): Promise<ListLogsResult> {
    // Validações básicas
    if (params.page && params.page < 1) {
      throw new Error('Página deve ser maior que 0');
    }

    if (params.limit && (params.limit < 1 || params.limit > 1000)) {
      throw new Error('Limite deve estar entre 1 e 1000');
    }

    if (params.startTime && params.endTime) {
      const startDate = new Date(params.startTime);
      const endDate = new Date(params.endTime);
      
      if (startDate > endDate) {
        throw new Error('Data de início deve ser anterior à data de fim');
      }
    }

    // Validação de formato de data
    if (params.startTime && isNaN(new Date(params.startTime).getTime())) {
      throw new Error('Formato de data de início inválido');
    }

    if (params.endTime && isNaN(new Date(params.endTime).getTime())) {
      throw new Error('Formato de data de fim inválido');
    }

    return await this.logRepository.listLogs(params);
  }
}
