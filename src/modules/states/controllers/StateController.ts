import { Request, Response } from 'express';
import { ListStatesUseCase } from '../useCases/ListStatesUseCase';
import { StateRepository } from '../repositories/StateRepository';
import { ListStatesDTO } from '../dtos/ListStatesDTO';
import AppError from '../../../shared/errors/AppError';

export class StateController {
  private listStatesUseCase: ListStatesUseCase;

  constructor() {
    const stateRepository = new StateRepository();
    this.listStatesUseCase = new ListStatesUseCase(stateRepository);
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { search, limit, page } = req.query;
      
      const params: ListStatesDTO = {
        search: search as string,
        limit: limit ? parseInt(limit as string) : 30,
        page: page ? parseInt(page as string) : 1,
      };

      const result = await this.listStatesUseCase.execute(params);

      return res.status(200).json({
        success: true,
        data: result.states,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
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
