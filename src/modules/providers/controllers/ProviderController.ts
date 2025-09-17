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
import { UpdateImgProfileUseCase } from '../useCases/UpdateImgProfileUseCase';

export class ProviderController {
  private createProviderUseCase: CreateProviderUseCase;
  private getProviderByIdUseCase: GetProviderByIdUseCase;
  private listProvidersUseCase: ListProvidersUseCase;
  private updateImgProfileUseCase: UpdateImgProfileUseCase;
  private updateProviderUseCase: UpdateProviderUseCase;
  private deleteProviderUseCase: DeleteProviderUseCase;

  constructor() {
    const providerRepository = new ProviderRepository();
    const sharedRepository = new SharedRepository();

    this.createProviderUseCase = new CreateProviderUseCase(providerRepository, sharedRepository);
    this.getProviderByIdUseCase = new GetProviderByIdUseCase(providerRepository);
    this.listProvidersUseCase = new ListProvidersUseCase(providerRepository);
    this.updateProviderUseCase = new UpdateProviderUseCase(providerRepository);
    this.updateImgProfileUseCase = new UpdateImgProfileUseCase(providerRepository);
    this.deleteProviderUseCase = new DeleteProviderUseCase(providerRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const data: CreateProviderDTO = req.body;
    const provider = await this.createProviderUseCase.execute(data);

    return res.status(201).json({
      success: true,
      data: provider,
      message: 'Provider criado com sucesso',
    });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { providerId } = req.params;
    const provider = await this.getProviderByIdUseCase.execute(providerId);

    return res.status(200).json({
      success: true,
      data: provider,
    });
  }

  async list(req: Request, res: Response): Promise<Response> {
    const { cityId, q: query, services } = req.query;

    const servicesArray = services ? services.toString().split(',') : [];

    const providers = await this.listProvidersUseCase.execute({
      cityId: cityId as string,
      query: query as string,
      services: servicesArray as string[],
    });

    return res.status(200).json({
      success: true,
      data: providers,
      count: providers.length,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: UpdateProviderDTO = req.body;
    const provider = await this.updateProviderUseCase.execute(id, data);

    return res.status(200).json({
      success: true,
      data: provider,
      message: 'Provider atualizado com sucesso',
    });
  }

  async updateImgProfile(req: Request, res: Response): Promise<Response> {
    const file = req.file!;
    const providerId = req.query.providerId as string;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: {
          title: 'Arquivo não encontrado',
          detail: 'Nenhum arquivo foi enviado',
          statusCode: 400,
        },
      });
    }

    const result = await this.updateImgProfileUseCase.execute(providerId, file);

    return res.status(200).json({
      success: true,
      data: result,
      url: result?.photoUrl,
      message: 'Foto de perfil atualizada com sucesso',
    });
  }


  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.deleteProviderUseCase.execute(id);

    return res.status(200).json({
      success: true,
      message: 'Provider deletado com sucesso',
    });
  }
}
