import { AdvertiserRepository } from '../repositories';

export class ListAdvertisersUseCase {
  constructor(private advertiserRepository: AdvertiserRepository) {}

  async execute() {
    const advertisers = await this.advertiserRepository.findAll();
    return advertisers;
  }
}
