import { Request, Response } from 'express';
import {
  CreateRequestUseCase,
  UpdateRequestUseCase,
  ListRequestsUseCase,
  GetRequestByIdUseCase,
  GetRequestsByClientIdUseCase,
  GetRequestsByProviderIdUseCase,
} from '../useCases';
import { RequestRepository } from '../repositories';
import { CreateRequestDTO, UpdateRequestDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { SendBudgetRequestDTO } from '../dtos/SendBudgetRequestDTO';
import { SendBudgetRequestUseCase } from '../useCases/SendBudgetRequestUseCase';
import { uploadToS3 } from '@/shared/helpers/uploadToS3';

export class RequestController {
  private createRequestUseCase: CreateRequestUseCase;
  private updateRequestUseCase: UpdateRequestUseCase;
  private sendBudgetRequestUseCase: SendBudgetRequestUseCase;
  private listRequestsUseCase: ListRequestsUseCase;
  private getRequestByIdUseCase: GetRequestByIdUseCase;
  private getRequestsByClientIdUseCase: GetRequestsByClientIdUseCase;
  private getRequestsByProviderIdUseCase: GetRequestsByProviderIdUseCase;

  constructor() {
    const requestRepository = new RequestRepository();

    this.createRequestUseCase = new CreateRequestUseCase(requestRepository);
    this.updateRequestUseCase = new UpdateRequestUseCase(requestRepository);
    this.listRequestsUseCase = new ListRequestsUseCase(requestRepository);
    this.sendBudgetRequestUseCase = new SendBudgetRequestUseCase(requestRepository);
    this.getRequestByIdUseCase = new GetRequestByIdUseCase(requestRepository);
    this.getRequestsByClientIdUseCase = new GetRequestsByClientIdUseCase(requestRepository);
    this.getRequestsByProviderIdUseCase = new GetRequestsByProviderIdUseCase(requestRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateRequestDTO = req.body;
      const request = await this.createRequestUseCase.execute(data);

      return res.status(201).json({
        success: true,
        data: request,
        message: 'Request criado com sucesso',
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
      const data: UpdateRequestDTO = req.body;
      const request = await this.updateRequestUseCase.execute(id, data);

      return res.status(200).json({
        success: true,
        data: request,
        message: 'Request atualizado com sucesso',
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

  async sendBudget(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: SendBudgetRequestDTO = req.body;
    await this.sendBudgetRequestUseCase.execute(id, data);

    return res.status(200).json({
      success: true,
      message: 'Orçamento enviado com sucesso',
    });
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const requests = await this.listRequestsUseCase.execute();

      return res.status(200).json({
        success: true,
        data: requests,
        count: requests.length,
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
      const request = await this.getRequestByIdUseCase.execute(id);

      return res.status(200).json({
        success: true,
        data: request,
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

  async getByClientId(req: Request, res: Response): Promise<Response> {
    try {
      const { clientId } = req.params;
      const requests = await this.getRequestsByClientIdUseCase.execute(clientId);

      return res.status(200).json({
        success: true,
        data: requests,
        count: requests.length,
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

  async getByProviderId(req: Request, res: Response): Promise<Response> {
    try {
      const { providerId } = req.params;
      const requests = await this.getRequestsByProviderIdUseCase.execute(providerId);

      return res.status(200).json({
        success: true,
        data: requests,
        count: requests.length,
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
