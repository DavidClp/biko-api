import { Request, Response } from 'express';
import { SharedRepository } from '../repositories/SharedRepository';
import { ServiceResponseDTO } from '../dtos/ServiceResponseDTO';
import AppError from '../../../shared/errors/AppError';

export class ServiceController {
  private sharedRepository: SharedRepository;

  constructor() {
    this.sharedRepository = new SharedRepository();
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.query;
      
      const services = await this.sharedRepository.listServices({
        name: name as string
      });

      const servicesResponse = services.map(service => new ServiceResponseDTO(service));

      return res.status(200).json({
        success: true,
        data: servicesResponse,
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
