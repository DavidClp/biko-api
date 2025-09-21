import { IProviderReviewRepository } from '../repositories';
import { CreateProviderReviewDTO, ProviderReviewResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class CreateProviderReviewUseCase {
  constructor(private providerReviewRepository: IProviderReviewRepository) {}

  async execute(data: CreateProviderReviewDTO): Promise<ProviderReviewResponseDTO> {
    // Validações
    if (!data.provider_id) {
      throw new AppError({
        title: 'Provider ID é obrigatório',
        statusCode: 400,
        detail: 'Provider ID é obrigatório',
      });
    }

    if (!data.review || data.review.trim().length === 0) {
      throw new AppError({
        title: 'Review é obrigatório',
        statusCode: 400,
        detail: 'Review é obrigatório',
      });
    }

    if (!data.stars || data.stars < 1 || data.stars > 5) {
      throw new AppError({
        title: 'Stars deve ser entre 1 e 5',
        statusCode: 400,  
        detail: 'Stars deve ser entre 1 e 5',
      });
    }

    const review = await this.providerReviewRepository.create(data);

    return review;
  }
}
