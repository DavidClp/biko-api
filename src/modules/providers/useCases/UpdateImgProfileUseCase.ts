import { IProviderRepository } from '../repositories';
import { ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { uploadToS3 } from '@/shared/helpers/uploadToS3';
import sharp from 'sharp';

export class UpdateImgProfileUseCase {
  constructor(private providerRepository: IProviderRepository) { }

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

    const webpBuffer = await sharp(file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 75, // Qualidade mais baixa para maior compressão
        effort: 6,   // Máximo esforço de compressão
      })
      .toBuffer();


    const webpFile: Express.Multer.File = {
      ...file,
      buffer: webpBuffer,
      mimetype: 'image/webp',
      originalname: file.originalname.replace(/\.[^/.]+$/, '.webp'),
    };

    const key = `profiles/${existingProvider?.name
      .toLowerCase()
      .normalize('NFD')          // separa letras e acentos
      .replace(/[\u0300-\u036f]/g, '') // remove os acentos
      .replace(/ /g, '-')        // espaços → hífen
      .replace(/[^a-z0-9-]/g, '') // remove outros caracteres inválidos
      }-${Date.now()}`;

    const url = await uploadToS3(webpFile, key);

    const updatedProvider = await this.providerRepository.update(id, {
      photoUrl: url
    });

    return updatedProvider;
  }
}
