import { BannerRepository } from '../repositories';
import { UpdateBannerDTO } from '../dtos';
import { uploadToS3 } from '@/shared/helpers/uploadToS3';
import { generateBannerImageKey } from '../helpers/bannerImageHelper';
import { deleteFromS3 } from '@/shared/helpers/deleteFromS3';
import AppError from '../../../shared/errors/AppError';

export class UpdateBannerUseCase {
  constructor(private bannerRepository: BannerRepository) {}

  async execute(id: string, data: UpdateBannerDTO) {
    if (!id) {
      throw new AppError({
        title: 'ID é obrigatório',
        detail: 'O ID do banner é obrigatório',
        statusCode: 400,
      });
    }

    const existingBanner = await this.bannerRepository.findById(id);
    
    if (!existingBanner) {
      throw new AppError({
        title: 'Banner não encontrado',
        detail: 'Nenhum banner foi encontrado com o ID fornecido',
        statusCode: 404,
      });
    }

    let updateData = { ...data };

    // Se há um novo arquivo de imagem, fazer upload e substituir a imagem antiga
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

      // Validar tamanho do arquivo
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (data.imageFile.size > maxSize) {
        throw new AppError({
          title: 'Arquivo muito grande',
          detail: 'O arquivo deve ter no máximo 5MB',
          statusCode: 400,
        });
      }

      // Gerar nova chave para o arquivo
      const newKey = generateBannerImageKey(
        existingBanner.advertiserId,
        existingBanner.position,
        existingBanner.size,
        data.imageFile.originalname
      );

      // Fazer upload da nova imagem
      const newImageUrl = await uploadToS3(data.imageFile, newKey, false);

      // Extrair chave da imagem antiga da URL
      const oldImageUrl = existingBanner.imageUrl;
      const oldKey = this.extractKeyFromUrl(oldImageUrl);

      // Deletar imagem antiga do S3
      if (oldKey) {
        try {
          await deleteFromS3(oldKey);
        } catch (error) {
          console.error('Erro ao deletar imagem antiga:', error);
          // Não falhar a operação se não conseguir deletar a imagem antiga
        }
      }

      // Atualizar URL da imagem
      updateData.imageUrl = newImageUrl;
    }

    // Remover imageFile dos dados antes de salvar no banco
    delete updateData.imageFile;

    const banner = await this.bannerRepository.update(id, updateData);
    return banner;
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      // Extrair a chave da URL do S3
      // URL format: https://bucket.s3.region.amazonaws.com/key
      const urlParts = url.split('/');
      if (urlParts.length >= 4) {
        return urlParts.slice(3).join('/');
      }
      return null;
    } catch (error) {
      console.error('Erro ao extrair chave da URL:', error);
      return null;
    }
  }
}
