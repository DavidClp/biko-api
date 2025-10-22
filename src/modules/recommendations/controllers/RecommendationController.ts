import { Request, Response } from 'express';
import {
  GenerateRecommendationCodeUseCase,
  CreateRecommendationUseCase,
  GetUserRecommendationsUseCase,
  GetUserByRecommendationCodeUseCase,
  GetAllRecommendationsUseCase,
} from '../useCases';
import { RecommendationRepository } from '../repositories';
import { GenerateRecommendationCodeDTO, CreateRecommendationDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class RecommendationController {
  private generateRecommendationCodeUseCase: GenerateRecommendationCodeUseCase;
  private createRecommendationUseCase: CreateRecommendationUseCase;
  private getUserRecommendationsUseCase: GetUserRecommendationsUseCase;
  private getUserByRecommendationCodeUseCase: GetUserByRecommendationCodeUseCase;
  private getAllRecommendationsUseCase: GetAllRecommendationsUseCase;

  constructor() {
    const recommendationRepository = new RecommendationRepository();

    this.generateRecommendationCodeUseCase = new GenerateRecommendationCodeUseCase(recommendationRepository);
    this.createRecommendationUseCase = new CreateRecommendationUseCase(recommendationRepository);
    this.getUserRecommendationsUseCase = new GetUserRecommendationsUseCase(recommendationRepository);
    this.getUserByRecommendationCodeUseCase = new GetUserByRecommendationCodeUseCase(recommendationRepository);
    this.getAllRecommendationsUseCase = new GetAllRecommendationsUseCase(recommendationRepository);
  }

  async generateCode(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
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

    const data: GenerateRecommendationCodeDTO = req.body;
    const user = await this.generateRecommendationCodeUseCase.execute(userId, data);

    return res.status(200).json({
      success: true,
      data: {
        recommendation_code: user.recommendation_code,
        cpf: user.cpf,
        pix_key: user.pix_key,
      },
      message: 'Código de recomendação gerado com sucesso',
    });
  }

  async createRecommendation(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
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

    const data: CreateRecommendationDTO = req.body;
    const recommendation = await this.createRecommendationUseCase.execute(userId, data);

    return res.status(201).json({
      success: true,
      data: recommendation,
      message: 'Recomendação criada com sucesso',
    });
  }

  async getUserRecommendations(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
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

    const recommendations = await this.getUserRecommendationsUseCase.execute(userId);

    return res.status(200).json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    });
  }

  async getUserByCode(req: Request, res: Response): Promise<Response> {
    const { code } = req.params;
    const user = await this.getUserByRecommendationCodeUseCase.execute(code);

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        recommendation_code: user.recommendation_code,
        cpf: user.cpf,
        pix_key: user.pix_key,
      },
    });
  }

  async getAllRecommendations(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await this.getAllRecommendationsUseCase.execute(page, limit, startDate, endDate);

    return res.status(200).json({
      success: true,
      data: result.recommendations,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  }
}
