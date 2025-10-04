import { Request, Response } from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../../../shared/helpers/S3Client';
import { CheckUserPermissionForRequestUseCase } from '../useCases/CheckUserPermissionForRequestUseCase';
import { RequestRepository } from '../../request/repositories/RequestRepository';
import AppError from '../../../shared/errors/AppError';

export class GetImageController {
  private checkUserPermissionForRequestUseCase: CheckUserPermissionForRequestUseCase;

  constructor() {
    const requestRepository = new RequestRepository();
    this.checkUserPermissionForRequestUseCase = new CheckUserPermissionForRequestUseCase(requestRepository);
  }

  async getImage(req: Request, res: Response): Promise<Response> {
    try {
      const { requestId, fileName } = req.params;
      const { token } = req.query;
      let userId = req.user?.id;


      if (!requestId || !fileName) {
        return res.status(400).json({
          success: false,
          error: {
            title: 'Parâmetros inválidos',
            detail: 'Request ID e nome do arquivo são obrigatórios',
            statusCode: 400,
          },
        });
      }

      
      // Se não há userId via middleware, mas há token via query, tentar validar o token
      if (!userId && token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.sub;
        } catch (error) {
          console.error('Token inválido via query:', error);
        }
      }
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            title: 'Não autorizado',
            detail: 'Usuário não autenticado',
            statusCode: 401,
          },
        });
      }

      // Verificar se o usuário tem permissão para acessar as imagens desta conversa
      const hasPermission = await this.checkUserPermissionForRequestUseCase.execute(userId, requestId);
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: {
            title: 'Acesso negado',
            detail: 'Você não tem permissão para acessar esta imagem',
            statusCode: 403,
          },
        });
      }

      // Construir a chave do S3
      const s3Key = `requests-images/${requestId}/${fileName}`;

      // Buscar a imagem do S3 e servir diretamente
      try {
        const getObjectCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: s3Key,
        });

        const s3Response = await s3.send(getObjectCommand);
        
        // Definir headers apropriados
        res.setHeader('Content-Type', s3Response.ContentType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
        res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir CORS
        
        // Pipe do S3 para a resposta
        // @ts-ignore
        s3Response.Body?.pipe(res);
        
        return res;
      } catch (s3Error) {
        console.error('Erro ao buscar imagem do S3:', s3Error);
        return res.status(404).json({
          success: false,
          error: {
            title: 'Imagem não encontrada',
            detail: 'A imagem solicitada não foi encontrada',
            statusCode: 404,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado ao acessar a imagem',
          statusCode: 500,
        },
      });
    }
  }
}
