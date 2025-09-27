import { IProviderPhotoRepository } from '../repositories';
import { ListProviderPhotosDTO } from '../dtos';

export class ListProviderPhotosUseCase {
  constructor(private providerPhotoRepository: IProviderPhotoRepository) {}

  async execute(data: ListProviderPhotosDTO) {
    return await this.providerPhotoRepository.list(data);
  }
}
