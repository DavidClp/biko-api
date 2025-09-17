import { IProviderRepository } from '../repositories';
import { UpdateProviderDTO, ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { uploadToS3 } from '@/shared/helpers/uploadToS3';

export class UpdateImgProfileUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute(id: string | undefined, file: Express.Multer.File): Promise<ProviderResponseDTO> {
    if (!id) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do provider é obrigatório',
        origin: 'UpdateProviderUseCase.execute',
        statusCode: 400,
      });
    }

    const existingProvider = await this.providerRepository.findById(id);
    if (!existingProvider) {
      throw new AppError({
        title: 'Provider não encontrado',
        detail: 'Provider com o ID especificado não foi encontrado',
        origin: 'UpdateProviderUseCase.execute',
        statusCode: 404,
      });
    }

    
    const key = `profiles/${existingProvider?.name}-${Date.now()}`;
    const url = await uploadToS3(file, key);

    console.log("url",url)
    console.log("key",key)
    
    const updatedProvider = await this.providerRepository.update(id, {
      photoUrl: url
    });

    return updatedProvider;
  }
}
