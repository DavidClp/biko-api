import { BannerRepository } from '../repositories';

export class ListBannersUseCase {
  constructor(private bannerRepository: BannerRepository) {}

  async execute() {
    const banners = await this.bannerRepository.findAll();
    return banners;
  }
}
