import { BannerRepository } from '../repositories';
import { AdvertiserRepository } from '../../advertisers/repositories';
import { CreateBannerDTO } from '../dtos';
import { uploadToS3 } from '@/shared/helpers/uploadToS3';
import { generateBannerImageKey } from '../helpers/bannerImageHelper';
import AppError from '../../../shared/errors/AppError';
import sharp from 'sharp';

export class CreateBannerUseCase {
  constructor(
    private bannerRepository: BannerRepository,
    private advertiserRepository: AdvertiserRepository
  ) {}

  async execute(data: CreateBannerDTO) {
    if (!data.title || data.title.trim().length === 0) {
      throw new AppError({
        title: 'Título é obrigatório',
        detail: 'O título do banner é obrigatório',
        statusCode: 400,
      });
    }

    if (!data.advertiserId) {
      throw new AppError({
        title: 'Anunciante é obrigatório',
        detail: 'O ID do anunciante é obrigatório',
        statusCode: 400,
      });
    }

    if (!data.imageFile && !data.imageUrl) {
      throw new AppError({
        title: 'Imagem é obrigatória',
        detail: 'É necessário fornecer uma imagem (arquivo ou URL)',
        statusCode: 400,
      });
    }

    let imageUrl = data.imageUrl;

    // Se um arquivo foi fornecido, fazer upload para S3
    if (data.imageFile) {
      // Validar tipo de arquivo
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(data.imageFile.mimetype)) {
        throw new AppError({
          title: 'Tipo de arquivo inválido',
          detail: 'Apenas arquivos JPEG, PNG e WebP são permitidos',
          statusCode: 400,
        });
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (data.imageFile.size > maxSize) {
        throw new AppError({
          title: 'Arquivo muito grande',
          detail: 'O arquivo deve ter no máximo 5MB',
          statusCode: 400,
        });
      }

      const key = generateBannerImageKey(
        data.advertiserId,
        data.position,
        data.size,
        data.imageFile.originalname
      );

      const webpBuffer = await sharp(data.imageFile.buffer)
        .rotate() 
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({
          quality: 85,  
          effort: 6,   
          smartSubsample: true 
        })
        .toBuffer();

      const webpFile: Express.Multer.File = {
        ...data.imageFile,
        buffer: webpBuffer,
        mimetype: 'image/webp',
        originalname: data.imageFile.originalname?.replace(/\.[^/.]+$/, '.webp'),
      };

      // Upload para S3
      imageUrl = await uploadToS3(webpFile, key, false);
    }

    // Criar banner com URL da imagem
      const bannerData = {
        ...data,
        imageUrl,
        publicVisibility: data.publicVisibility || 'ALL',
      };

    // Remover imageFile dos dados antes de salvar
    delete (bannerData as any).imageFile;

    const banner = await this.bannerRepository.create(bannerData);
    return banner;
  }
}
