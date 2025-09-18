import { Request, Response } from 'express';
import {
  CreateProviderReviewUseCase,
  GetProviderReviewsUseCase,
} from '../useCases';
import { ProviderReviewRepository } from '../repositories';
import { CreateProviderReviewDTO, ListProviderReviewsDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class ProviderReviewController {
  private createProviderReviewUseCase: CreateProviderReviewUseCase;
  private getProviderReviewsUseCase: GetProviderReviewsUseCase;

  constructor() {
    const providerReviewRepository = new ProviderReviewRepository();

    this.createProviderReviewUseCase = new CreateProviderReviewUseCase(providerReviewRepository);
    this.getProviderReviewsUseCase = new GetProviderReviewsUseCase(providerReviewRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const data: CreateProviderReviewDTO = req.body;
    const review = await this.createProviderReviewUseCase.execute(data);

    return res.status(201).json({
      success: true,
      data: review,
      message: 'Review criado com sucesso',
    });
  }

  async getByProviderId(req: Request, res: Response): Promise<Response> {
    const { providerId } = req.params;
    const { limit, page } = req.query;

    const params: ListProviderReviewsDTO = {
      providerId,
      limit: limit ? parseInt(limit as string) : 10,
      page: page ? parseInt(page as string) : 1,
    };

    const result = await this.getProviderReviewsUseCase.execute(params);

    return res.status(200).json({
      data: {
        success: true,
        data: result.reviews,
        count: result.reviews.length,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    });
  }
}
