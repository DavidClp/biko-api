import { RecommendationRepository } from '../repositories';
import { CreateRecommendationDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class CreateRecommendationUseCase {
  constructor(private recommendationRepository: RecommendationRepository) {}

  async execute(giverId: string, data: CreateRecommendationDTO) {
    if (!data.recommendationCode || data.recommendationCode.trim().length === 0) {
      throw new AppError({
        title: 'Código de recomendação é obrigatório',
        detail: 'O código de recomendação é obrigatório',
        statusCode: 400,
      });
    }

    // Busca o usuário pelo código de recomendação
    const recommendedUser = await this.recommendationRepository.findRecommendationByCode(
      data.recommendationCode
    );

    if (!recommendedUser) {
      throw new AppError({
        title: 'Código de recomendação inválido',
        detail: 'O código de recomendação fornecido não existe',
        statusCode: 404,
      });
    }

    // Verifica se o usuário recomendado é um prestador
    if (recommendedUser.role !== 'PROVIDER') {
      throw new AppError({
        title: 'Apenas prestadores podem ser recomendados',
        detail: 'O código de recomendação deve pertencer a um prestador',
        statusCode: 400,
      });
    }

    // Verifica se já existe uma recomendação entre estes usuários
    const alreadyRecommended = await this.recommendationRepository.checkIfAlreadyRecommended(
      giverId,
      recommendedUser.id
    );

    if (alreadyRecommended) {
      throw new AppError({
        title: 'Recomendação já existe',
        detail: 'Você já recomendou este prestador anteriormente',
        statusCode: 400,
      });
    }

    // Verifica se o usuário não está tentando se recomendar
    if (giverId === recommendedUser.id) {
      throw new AppError({
        title: 'Não é possível se recomendar',
        detail: 'Você não pode usar seu próprio código de recomendação',
        statusCode: 400,
      });
    }

    const recommendation = await this.recommendationRepository.createRecommendation(
      giverId,
      recommendedUser.id
    );

    return recommendation;
  }
}
