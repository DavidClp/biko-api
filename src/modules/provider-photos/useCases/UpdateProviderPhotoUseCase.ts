import { IProviderPhotoRepository } from '../repositories';
import { UpdateProviderPhotoDTO, ProviderPhotoResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class UpdateProviderPhotoUseCase {
  constructor(private providerPhotoRepository: IProviderPhotoRepository) {}

  async execute(id: string, data: UpdateProviderPhotoDTO): Promise<ProviderPhotoResponseDTO> {
    const existingPhoto = await this.providerPhotoRepository.findById(id);
    
    if (!existingPhoto) {
      throw new AppError({
        title: 'Foto não encontrada',
        detail: 'A foto especificada não foi encontrada',
        origin: 'UpdateProviderPhotoUseCase.execute',
        statusCode: 404,
      });
    }

    const updatedPhoto = await this.providerPhotoRepository.update(id, data);

    return new ProviderPhotoResponseDTO(updatedPhoto);
  }
}
