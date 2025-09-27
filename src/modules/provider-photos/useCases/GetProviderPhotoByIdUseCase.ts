import { IProviderPhotoRepository } from '../repositories';
import { ProviderPhotoResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GetProviderPhotoByIdUseCase {
  constructor(private providerPhotoRepository: IProviderPhotoRepository) {}

  async execute(id: string): Promise<ProviderPhotoResponseDTO> {
    const photo = await this.providerPhotoRepository.findById(id);
    
    if (!photo) {
      throw new AppError({
        title: 'Foto não encontrada',
        detail: 'A foto especificada não foi encontrada',
        origin: 'GetProviderPhotoByIdUseCase.execute',
        statusCode: 404,
      });
    }

    return new ProviderPhotoResponseDTO(photo);
  }
}
