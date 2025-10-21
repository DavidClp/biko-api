import { Request, Response } from 'express';
import {
  GenerateRecommendationCodeUseCase,
  CreateRecommendationUseCase,
  GetUserRecommendationsUseCase,
  GetUserByRecommendationCodeUseCase,
} from '../useCases';
import { RecommendationRepository } from '../repositories';
import { GenerateRecommendationCodeDTO, CreateRecommendationDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class RecommendationController {
  private generateRecommendationCodeUseCase: GenerateRecommendationCodeUseCase;
  private createRecommendationUseCase: CreateRecommendationUseCase;
  private getUserRecommendationsUseCase: GetUserRecommendationsUseCase;
  private getUserByRecommendationCodeUseCase: GetUserByRecommendationCodeUseCase;

  constructor() {
    const recommendationRepository = new RecommendationRepository();

    this.generateRecommendationCodeUseCase = new GenerateRecommendationCodeUseCase(recommendationRepository);
    this.createRecommendationUseCase = new CreateRecommendationUseCase(recommendationRepository);
    this.getUserRecommendationsUseCase = new GetUserRecommendationsUseCase(recommendationRepository);
    this.getUserByRecommendationCodeUseCase = new GetUserByRecommendationCodeUseCase(recommendationRepository);
  }

  async generateCode(req: Request, res: Response): Promise<Response> {
    try {
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

  async createRecommendation(req: Request, res: Response): Promise<Response> {
    try {
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

  async getUserRecommendations(req: Request, res: Response): Promise<Response> {
    try {
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

  async getUserByCode(req: Request, res: Response): Promise<Response> {
    try {
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
          client: user.client,
          provider: user.provider,
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
