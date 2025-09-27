import { IProviderPhotoRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';
import { deleteFromS3 } from '../../../shared/helpers/deleteFromS3';

export class DeleteProviderPhotoUseCase {
  constructor(private providerPhotoRepository: IProviderPhotoRepository) {}

  async execute(id: string): Promise<void> {
    const existingPhoto = await this.providerPhotoRepository.findById(id);
    
    if (!existingPhoto) {
      throw new AppError({
        title: 'Foto não encontrada',
        detail: 'A foto especificada não foi encontrada',
        origin: 'DeleteProviderPhotoUseCase.execute',
        statusCode: 404,
      });
    }

    // Extrair a chave do S3 da URL
    const s3Key = this.extractS3KeyFromUrl(existingPhoto.photo_url);
    
    try {
      // Deletar do banco de dados primeiro
      await this.providerPhotoRepository.delete(id);
      
      // Deletar do S3
      if (s3Key) {
        await deleteFromS3(s3Key);
      }
    } catch (error) {
      // Se falhar ao deletar do S3, logar o erro mas não falhar a operação
      // pois o registro já foi removido do banco
      console.error('Erro ao deletar arquivo do S3:', error);
    }
  }

  private extractS3KeyFromUrl(url: string): string | null {
    try {
      // URL format: https://bucket-name.s3.amazonaws.com/key
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Remove a barra inicial se existir
      return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch (error) {
      console.error('Erro ao extrair chave S3 da URL:', error);
      return null;
    }
  }
}
