import { IProviderPhotoRepository } from '../repositories';
import { CreateProviderPhotoDTO, ProviderPhotoResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { IProviderRepository } from '../../providers/repositories';

export class CreateProviderPhotoUseCase {
  constructor(
    private providerPhotoRepository: IProviderPhotoRepository,
    private providerRepository: IProviderRepository
  ) {}

  async execute(data: CreateProviderPhotoDTO): Promise<ProviderPhotoResponseDTO> {
    await this.validatePhotoLimit(data.provider_id);

    const photo = await this.providerPhotoRepository.create(data);

    return new ProviderPhotoResponseDTO(photo);
  }

  private async validatePhotoLimit(providerId: string): Promise<void> {
    const [provider, currentPhotoCount] = await Promise.all([
      this.providerRepository.findByIdComplete(providerId),
      this.providerPhotoRepository.countByProviderId(providerId),
    ]);
    
    if (!provider) {
      throw new AppError({
        title: 'Profissional não encontrado',
        detail: 'O profissional especificado não foi encontrado',
        origin: 'CreateProviderPhotoUseCase.execute',
        statusCode: 404,
      });
    }

    // Buscar informações do plano do profissional
    const subscription = provider?.subscription;

    const planName = subscription?.plans?.name;
    let maxPhotos = 0;

    if (planName?.toUpperCase().includes('PRESTADOR')) {
      maxPhotos = 5;
    } else if (planName?.toUpperCase().includes('PROFISSIONAL+')) {
      maxPhotos = 10;
    } else {
      maxPhotos = 1;
    }

    if (currentPhotoCount >= maxPhotos) {
      throw new AppError({
        title: 'Limite de fotos atingido',
        detail: `Seu plano ${planName || 'GRATIS'} permite apenas ${maxPhotos} foto(s). Atualize seu plano para adicionar mais fotos.`,
        origin: 'CreateProviderPhotoUseCase.execute',
        statusCode: 400,
      });
    }
  }
}
