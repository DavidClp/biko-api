import { BannerRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';

export class IncrementBannerViewUseCase {
  constructor(private bannerRepository: BannerRepository) {}

  async execute(id: string) {
    if (!id) {
      throw new AppError({
        title: 'ID é obrigatório',
        detail: 'O ID do banner é obrigatório',
        statusCode: 400,
      });
    }

    const existingBanner = await this.bannerRepository.findById(id);
    
    if (!existingBanner) {
      throw new AppError({
        title: 'Banner não encontrado',
        detail: 'Nenhum banner foi encontrado com o ID fornecido',
        statusCode: 404,
      });
    }

    await this.bannerRepository.incrementViewCount(id);
  }
}
