import { AdvertiserRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';

export class DeleteAdvertiserUseCase {
  constructor(private advertiserRepository: AdvertiserRepository) {}

  async execute(id: string) {
    if (!id) {
      throw new AppError({
        title: 'ID é obrigatório',
        detail: 'O ID do anunciante é obrigatório',
        statusCode: 400,
      });
    }

    const existingAdvertiser = await this.advertiserRepository.findById(id);
    
    if (!existingAdvertiser) {
      throw new AppError({
        title: 'Anunciante não encontrado',
        detail: 'Nenhum anunciante foi encontrado com o ID fornecido',
        statusCode: 404,
      });
    }

    await this.advertiserRepository.delete(id);
  }
}
