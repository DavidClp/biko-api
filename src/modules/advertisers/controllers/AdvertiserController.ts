import { Request, Response } from 'express';
import {
  CreateAdvertiserUseCase,
  UpdateAdvertiserUseCase,
  ListAdvertisersUseCase,
  GetAdvertiserByIdUseCase,
  DeleteAdvertiserUseCase,
} from '../useCases';
import { AdvertiserRepository } from '../repositories';
import { CreateAdvertiserDTO, UpdateAdvertiserDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class AdvertiserController {
  private createAdvertiserUseCase: CreateAdvertiserUseCase;
  private updateAdvertiserUseCase: UpdateAdvertiserUseCase;
  private listAdvertisersUseCase: ListAdvertisersUseCase;
  private getAdvertiserByIdUseCase: GetAdvertiserByIdUseCase;
  private deleteAdvertiserUseCase: DeleteAdvertiserUseCase;

  constructor() {
    const advertiserRepository = new AdvertiserRepository();

    this.createAdvertiserUseCase = new CreateAdvertiserUseCase(advertiserRepository);
    this.updateAdvertiserUseCase = new UpdateAdvertiserUseCase(advertiserRepository);
    this.listAdvertisersUseCase = new ListAdvertisersUseCase(advertiserRepository);
    this.getAdvertiserByIdUseCase = new GetAdvertiserByIdUseCase(advertiserRepository);
    this.deleteAdvertiserUseCase = new DeleteAdvertiserUseCase(advertiserRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateAdvertiserDTO = req.body;
      const advertiser = await this.createAdvertiserUseCase.execute(data);

      return res.status(201).json({
        success: true,
        data: advertiser,
        message: 'Anunciante criado com sucesso',
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
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: UpdateAdvertiserDTO = req.body;
      const advertiser = await this.updateAdvertiserUseCase.execute(id, data);

      return res.status(200).json({
        success: true,
        data: advertiser,
        message: 'Anunciante atualizado com sucesso',
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
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const advertisers = await this.listAdvertisersUseCase.execute();

      return res.status(200).json({
        success: true,
        data: advertisers,
        count: advertisers.length,
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
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const advertiser = await this.getAdvertiserByIdUseCase.execute(id);

      return res.status(200).json({
        success: true,
        data: advertiser,
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
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteAdvertiserUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Anunciante removido com sucesso',
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
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }
}
