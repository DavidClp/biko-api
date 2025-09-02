import { Request, Response } from 'express';
import {
  CreateProviderUseCase,
  GetProviderByIdUseCase,
  ListProvidersUseCase,
  UpdateProviderUseCase,
  DeleteProviderUseCase,
} from '../useCases';
import { ProviderRepository } from '../repositories';
import { CreateProviderDTO, UpdateProviderDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { SharedRepository } from '@/modules/shared/repositories/SharedRepository';

export class ProviderController {
  private createProviderUseCase: CreateProviderUseCase;
  private getProviderByIdUseCase: GetProviderByIdUseCase;
  private listProvidersUseCase: ListProvidersUseCase;
  private updateProviderUseCase: UpdateProviderUseCase;
  private deleteProviderUseCase: DeleteProviderUseCase;

  constructor() {
    const providerRepository = new ProviderRepository();
    const sharedRepository = new SharedRepository();

    this.createProviderUseCase = new CreateProviderUseCase(providerRepository, sharedRepository);
    this.getProviderByIdUseCase = new GetProviderByIdUseCase(providerRepository);
    this.listProvidersUseCase = new ListProvidersUseCase(providerRepository);
    this.updateProviderUseCase = new UpdateProviderUseCase(providerRepository);
    this.deleteProviderUseCase = new DeleteProviderUseCase(providerRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateProviderDTO = req.body;
      const provider = await this.createProviderUseCase.execute(data);

      return res.status(201).json({
        success: true,
        data: provider,
        message: 'Provider criado com sucesso',
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
      const { providerId } = req.params;
      const provider = await this.getProviderByIdUseCase.execute(providerId);

      return res.status(200).json({
        success: true,
        data: provider,
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
      const providers = await this.listProvidersUseCase.execute();

      return res.status(200).json({
        success: true,
        data: providers,
        count: providers.length,
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
      const data: UpdateProviderDTO = req.body;
      const provider = await this.updateProviderUseCase.execute(id, data);

      return res.status(200).json({
        success: true,
        data: provider,
        message: 'Provider atualizado com sucesso',
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
      await this.deleteProviderUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Provider deletado com sucesso',
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
