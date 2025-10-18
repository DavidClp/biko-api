import { AdvertiserRepository } from '../repositories';
import { UpdateAdvertiserDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class UpdateAdvertiserUseCase {
  constructor(private advertiserRepository: AdvertiserRepository) {}

  async execute(id: string, data: UpdateAdvertiserDTO) {
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

    const advertiser = await this.advertiserRepository.update(id, data);
    return advertiser;
  }
}
