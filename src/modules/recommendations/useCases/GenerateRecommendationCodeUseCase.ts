import { RecommendationRepository } from '../repositories';
import { GenerateRecommendationCodeDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GenerateRecommendationCodeUseCase {
  constructor(private recommendationRepository: RecommendationRepository) {}

  async execute(userId: string, data: GenerateRecommendationCodeDTO) {
    if (!data.cpf || data.cpf.trim().length === 0) {
      throw new AppError({
        title: 'CPF é obrigatório',
        detail: 'O CPF é obrigatório para gerar o código de recomendação',
        statusCode: 400,
      });
    }

    if (!data.pixKey || data.pixKey.trim().length === 0) {
      throw new AppError({
        title: 'Chave PIX é obrigatória',
        detail: 'A chave PIX é obrigatória para gerar o código de recomendação',
        statusCode: 400,
      });
    }

    // Validação básica de CPF (11 dígitos)
    const cpfNumbers = data.cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      throw new AppError({
        title: 'CPF inválido',
        detail: 'O CPF deve conter 11 dígitos',
        statusCode: 400,
      });
    }

    // Verifica se o usuário já possui um código de recomendação
    const existingUser = await this.recommendationRepository.getUserById(userId);
    if (existingUser?.recommendation_code) {
      throw new AppError({
        title: 'Código já existe',
        detail: 'Você já possui um código de recomendação. Não é possível gerar um novo.',
        statusCode: 400,
      });
    }

    const user = await this.recommendationRepository.generateRecommendationCode(
      userId,
      cpfNumbers,
      data.pixKey
    );

    return user;
  }
}
