import { Request, Response } from 'express';
import { ListCitiesUseCase } from '../useCases/ListCitiesUseCase';
import { CityRepository } from '../repositories/CityRepository';
import { ListCitiesDTO } from '../dtos/ListCitiesDTO';
import AppError from '../../../shared/errors/AppError';

export class CityController {
  private listCitiesUseCase: ListCitiesUseCase;

  constructor() {
    const cityRepository = new CityRepository();
    this.listCitiesUseCase = new ListCitiesUseCase(cityRepository);
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { search, limit, page } = req.query;
      
      const params: ListCitiesDTO = {
        search: search as string,
        limit: limit ? parseInt(limit as string) : 20,
        page: page ? parseInt(page as string) : 1,
      };

      const result = await this.listCitiesUseCase.execute(params);

      return res.status(200).json({
        success: true,
        data: result.cities,
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
