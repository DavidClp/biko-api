import { Request, Response } from 'express';
import { uploadToS3 } from '@/shared/helpers/uploadToS3';
import AppError from '../../../shared/errors/AppError';

export class UploadBannerImageController {
  async upload(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        throw new AppError({
          title: 'Arquivo não fornecido',
          detail: 'É necessário fornecer uma imagem para upload',
          statusCode: 400,
        });
      }

      // Validar tipo de arquivo
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        throw new AppError({
          title: 'Tipo de arquivo inválido',
          detail: 'Apenas arquivos JPEG, PNG e WebP são permitidos',
          statusCode: 400,
        });
      }

      // Validar tamanho do arquivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new AppError({
          title: 'Arquivo muito grande',
          detail: 'O arquivo deve ter no máximo 5MB',
          statusCode: 400,
        });
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `banner-${timestamp}-${randomString}.${fileExtension}`;
      const key = `advertisers/banners/${fileName}`;

      // Upload para S3
      const imageUrl = await uploadToS3(req.file, key, false);

      return res.status(200).json({
        success: true,
        data: {
          imageUrl,
          fileName,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
        message: 'Imagem enviada com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          error: error.error,
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado durante o upload',
          statusCode: 500,
        },
      });
    }
  }
}
