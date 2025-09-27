import { Request, Response } from 'express';
import {
  CreateProviderPhotoUseCase,
  GetProviderPhotoByIdUseCase,
  ListProviderPhotosUseCase,
  UpdateProviderPhotoUseCase,
  DeleteProviderPhotoUseCase,
} from '../useCases';
import { ProviderPhotoRepository } from '../repositories';
import { CreateProviderPhotoDTO, UpdateProviderPhotoDTO, ListProviderPhotosDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { ProviderRepository } from '../../providers/repositories';
import { uploadToS3 } from '../../../shared/helpers/uploadToS3';
import sharp from 'sharp';

export class ProviderPhotoController {
  private createProviderPhotoUseCase: CreateProviderPhotoUseCase;
  private getProviderPhotoByIdUseCase: GetProviderPhotoByIdUseCase;
  private listProviderPhotosUseCase: ListProviderPhotosUseCase;
  private updateProviderPhotoUseCase: UpdateProviderPhotoUseCase;
  private deleteProviderPhotoUseCase: DeleteProviderPhotoUseCase;

  constructor() {
    const providerPhotoRepository = new ProviderPhotoRepository();
    const providerRepository = new ProviderRepository();

    this.createProviderPhotoUseCase = new CreateProviderPhotoUseCase(providerPhotoRepository, providerRepository);
    this.getProviderPhotoByIdUseCase = new GetProviderPhotoByIdUseCase(providerPhotoRepository);
    this.listProviderPhotosUseCase = new ListProviderPhotosUseCase(providerPhotoRepository);
    this.updateProviderPhotoUseCase = new UpdateProviderPhotoUseCase(providerPhotoRepository);
    this.deleteProviderPhotoUseCase = new DeleteProviderPhotoUseCase(providerPhotoRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { providerId } = req.params;
      const { description, order } = req.body;

      if (!req.file) {
        throw new AppError({
          title: 'Arquivo não encontrado',
          detail: 'É necessário enviar uma foto',
          origin: 'ProviderPhotoController.create',
          statusCode: 400,
        });
      }

      const webpBuffer = await sharp(req.file?.buffer)
        .resize(1024, 1024, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({
          quality: 85, // Qualidade mais baixa para maior compressão
        })
        .toBuffer();

      const webpFile: Express.Multer.File = {
        ...req.file,
        buffer: webpBuffer,
        mimetype: 'image/webp',
        originalname: req.file?.originalname?.replace(/\.[^/.]+$/, '.webp'),
      };

      // Upload da foto para S3
      const key = `provider-photos/${providerId}/${Date.now()}-${req.file.originalname}`;
      const photoUrl = await uploadToS3(webpFile, key);

      const data: CreateProviderPhotoDTO = {
        provider_id: providerId,
        photo_url: photoUrl,
        description,
        order: order || 0,
      };

      const photo = await this.createProviderPhotoUseCase.execute(data);

      return res.status(201).json({
        success: true,
        data: photo,
        message: 'Foto adicionada com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          message: error.error.title,
          detail: error.error.detail,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        detail: 'Ocorreu um erro inesperado',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { photoId } = req.params;
      const photo = await this.getProviderPhotoByIdUseCase.execute(photoId);

      return res.status(200).json({
        success: true,
        data: photo,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          message: error.error.title,
          detail: error.error.detail,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        detail: 'Ocorreu um erro inesperado',
      });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { providerId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const data: ListProviderPhotosDTO = {
        provider_id: providerId,
        page: Number(page),
        limit: Number(limit),
      };

      const result = await this.listProviderPhotosUseCase.execute(data);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          message: error.error.title,
          detail: error.error.detail,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        detail: 'Ocorreu um erro inesperado',
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { photoId } = req.params;
      const data: UpdateProviderPhotoDTO = req.body;

      const photo = await this.updateProviderPhotoUseCase.execute(photoId, data);

      return res.status(200).json({
        success: true,
        data: photo,
        message: 'Foto atualizada com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          message: error.error.title,
          detail: error.error.detail,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        detail: 'Ocorreu um erro inesperado',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { photoId } = req.params;
      await this.deleteProviderPhotoUseCase.execute(photoId);

      return res.status(200).json({
        success: true,
        message: 'Foto removida com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          message: error.error.title,
          detail: error.error.detail,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        detail: 'Ocorreu um erro inesperado',
      });
    }
  }
}
