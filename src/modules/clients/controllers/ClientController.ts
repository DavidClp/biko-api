import { Request, Response } from 'express';
import {
  CreateClientUseCase,
  GetClientByIdUseCase,
  ListClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
} from '../useCases';
import { ClientRepository } from '../repositories';
import { CreateClientDTO, UpdateClientDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { SharedRepository } from '@/modules/shared/repositories/SharedRepository';

export class ClientController {
  private createClientUseCase: CreateClientUseCase;
  private getClientByIdUseCase: GetClientByIdUseCase;
  private listClientsUseCase: ListClientsUseCase;
  private updateClientUseCase: UpdateClientUseCase;
  private deleteClientUseCase: DeleteClientUseCase;

  constructor() {
    const clientRepository = new ClientRepository();
    const sharedRepository = new SharedRepository();

    this.createClientUseCase = new CreateClientUseCase(clientRepository, sharedRepository);
    this.getClientByIdUseCase = new GetClientByIdUseCase(clientRepository);
    this.listClientsUseCase = new ListClientsUseCase(clientRepository);
    this.updateClientUseCase = new UpdateClientUseCase(clientRepository);
    this.deleteClientUseCase = new DeleteClientUseCase(clientRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
      const data: CreateClientDTO = req.body;

      const client = await this.createClientUseCase.execute(data);

      return res.status(201).json({
        success: true,
        data: client,
        message: 'Client criado com sucesso',
      });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const client = await this.getClientByIdUseCase.execute(id);

      return res.status(200).json({
        success: true,
        data: client,
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
      const clients = await this.listClientsUseCase.execute();

      return res.status(200).json({
        success: true,
        data: clients,
        count: clients.length,
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
      const data: UpdateClientDTO = req.body;
      const client = await this.updateClientUseCase.execute(id, data);

      return res.status(200).json({
        success: true,
        data: client,
        message: 'Client atualizado com sucesso',
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
      await this.deleteClientUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Client deletado com sucesso',
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
