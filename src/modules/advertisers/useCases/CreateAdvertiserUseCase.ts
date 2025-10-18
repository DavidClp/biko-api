import { AdvertiserRepository } from '../repositories';
import { CreateAdvertiserDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class CreateAdvertiserUseCase {
  constructor(private advertiserRepository: AdvertiserRepository) {}

  async execute(data: CreateAdvertiserDTO) {
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError({
        title: 'Nome é obrigatório',
        detail: 'O nome do anunciante é obrigatório',
        statusCode: 400,
      });
    }

    const advertiser = await this.advertiserRepository.create(data);
    return advertiser;
  }
}
