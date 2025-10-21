import { RecommendationRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';

export class GetUserByRecommendationCodeUseCase {
  constructor(private recommendationRepository: RecommendationRepository) {}

  async execute(code: string) {
    if (!code || code.trim().length === 0) {
      throw new AppError({
        title: 'Código de recomendação é obrigatório',
        detail: 'O código de recomendação é obrigatório',
        statusCode: 400,
      });
    }

    const user = await this.recommendationRepository.getUserByRecommendationCode(code);
    
    if (!user) {
      throw new AppError({
        title: 'Código de recomendação não encontrado',
        detail: 'O código de recomendação fornecido não existe',
        statusCode: 404,
      });
    }

    return user;
  }
}
