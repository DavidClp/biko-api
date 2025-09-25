import { Request, Response } from 'express';
import { ListLogsUseCase } from '../useCases/ListLogsUseCase';
import { LogRepository } from '../repositories/LogRepository';
import { ListLogsDTO } from '../dtos/ListLogsDTO';
import AppError from '../../../shared/errors/AppError';

export class LogController {
  private listLogsUseCase: ListLogsUseCase;
  private logRepository: LogRepository;

  constructor() {
    this.logRepository = new LogRepository();
    this.listLogsUseCase = new ListLogsUseCase(this.logRepository);
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { 
        level, 
        method, 
        startTime, 
        endTime, 
        limit, 
        page 
      } = req.query;
      
      const params: ListLogsDTO = {
        level: level ? parseInt(level as string) : undefined,
        method: method as string,
        startTime: startTime as string,
        endTime: endTime as string,
        limit: limit ? parseInt(limit as string) : 50,
        page: page ? parseInt(page as string) : 1,
      };

      const result = await this.listLogsUseCase.execute(params);

      return res.status(200).json({
        success: true,
        data: result.logs,
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
          detail: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async stats(req: Request, res: Response): Promise<Response> {
    try {
      const stats = await this.logRepository.getLogStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }
}
