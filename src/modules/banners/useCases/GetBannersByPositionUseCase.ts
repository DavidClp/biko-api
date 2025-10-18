import { BannerRepository } from '../repositories';
import { BannerPosition } from '@prisma/client';
import AppError from '../../../shared/errors/AppError';

export class GetBannersByPositionUseCase {
  constructor(private bannerRepository: BannerRepository) {}

  async execute(position: BannerPosition, userRole?: string) {
    if (!position) {
      throw new AppError({
        title: 'Posição é obrigatória',
        detail: 'A posição do banner é obrigatória',
        statusCode: 400,
      });
    }

    const banners = await this.bannerRepository.findByPosition(position, userRole);
    return banners;
  }
}
