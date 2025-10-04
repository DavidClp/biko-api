import { Request, Response } from 'express';
import { uploadToS3 } from '../../../shared/helpers/uploadToS3';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../../../shared/errors/AppError';
import sharp from 'sharp';

export class UploadImageController {
  async upload(req: Request, res: Response): Promise<Response> {
    try {
      const { requestId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: {
            title: 'Arquivo não encontrado',
            detail: 'Nenhum arquivo foi enviado',
            statusCode: 400,
          },
        });
      }

      if (!requestId) {
        return res.status(400).json({
          success: false,
          error: {
            title: 'Request ID não encontrado',
            detail: 'O ID da solicitação é obrigatório',
            statusCode: 400,
          },
        });
      }

      // Validar tipo de arquivo
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          error: {
            title: 'Tipo de arquivo inválido',
            detail: 'Apenas arquivos de imagem são permitidos',
            statusCode: 400,
          },
        });
      }

      // Validar tamanho do arquivo (10MB)
      if (file.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: {
            title: 'Arquivo muito grande',
            detail: 'O arquivo deve ter no máximo 10MB',
            statusCode: 400,
          },
        });
      }

      // Gerar nome único para o arquivo
      const fileName = `${uuidv4()}.webp`;
      
      // Definir a chave do S3 com a estrutura: requests-images/{requestId}/{fileName}
      const s3Key = `requests-images/${requestId}/${fileName}`;

      const webpBuffer = await sharp(file?.buffer)
        .rotate() // corrige rotação automática
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({
          quality: 85, // ✅ Balance entre qualidade e tamanho
          effort: 6,   // ✅ Velocidade vs compressão
          smartSubsample: true // Melhora compressão
        })
        .toBuffer();

      const webpFile: Express.Multer.File = {
        ...file,
        buffer: webpBuffer,
        mimetype: 'image/webp',
        originalname: file?.originalname?.replace(/\.[^/.]+$/, '.webp'),
      };

      // Fazer upload para o S3 (sem ACL pública para manter privado)
      await uploadToS3(webpFile, s3Key, false);

      // Retornar a URL da API que irá gerar URLs assinadas
      const imageUrl = `/messages/image/${requestId}/${fileName}`;

      return res.status(200).json({
        success: true,
        data: {
          imageUrl,
          fileName,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        },
        message: 'Imagem enviada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);

      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado ao fazer upload da imagem',
          statusCode: 500,
        },
      });
    }
  }
}
