import { Request, Response } from 'express';
import {
  CreateBannerUseCase,
  UpdateBannerUseCase,
  ListBannersUseCase,
  GetBannerByIdUseCase,
  DeleteBannerUseCase,
  GetBannersByPositionUseCase,
  IncrementBannerClickUseCase,
  IncrementBannerViewUseCase,
} from '../useCases';
import { BannerRepository } from '../repositories';
import { AdvertiserRepository } from '../../advertisers/repositories';
import { CreateBannerDTO, UpdateBannerDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class BannerController {
  private createBannerUseCase: CreateBannerUseCase;
  private updateBannerUseCase: UpdateBannerUseCase;
  private listBannersUseCase: ListBannersUseCase;
  private getBannerByIdUseCase: GetBannerByIdUseCase;
  private deleteBannerUseCase: DeleteBannerUseCase;
  private getBannersByPositionUseCase: GetBannersByPositionUseCase;
  private incrementBannerClickUseCase: IncrementBannerClickUseCase;
  private incrementBannerViewUseCase: IncrementBannerViewUseCase;

  constructor() {
    const bannerRepository = new BannerRepository();
    const advertiserRepository = new AdvertiserRepository();

    this.createBannerUseCase = new CreateBannerUseCase(bannerRepository, advertiserRepository);
    this.updateBannerUseCase = new UpdateBannerUseCase(bannerRepository);
    this.listBannersUseCase = new ListBannersUseCase(bannerRepository);
    this.getBannerByIdUseCase = new GetBannerByIdUseCase(bannerRepository);
    this.deleteBannerUseCase = new DeleteBannerUseCase(bannerRepository);
    this.getBannersByPositionUseCase = new GetBannersByPositionUseCase(bannerRepository);
    this.incrementBannerClickUseCase = new IncrementBannerClickUseCase(bannerRepository);
    this.incrementBannerViewUseCase = new IncrementBannerViewUseCase(bannerRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const data: CreateBannerDTO = {
      advertiserId: req.body.advertiserId,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      position: req.body.position,
      size: req.body.size,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      imageFile: req.file, // Arquivo do multer
    };

    const banner = await this.createBannerUseCase.execute(data);

    return res.status(201).json({
      success: true,
      data: banner,
      message: 'Banner criado com sucesso',
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: UpdateBannerDTO = {
      ...req.body,
      imageFile: req.file,
    };

    const banner = await this.updateBannerUseCase.execute(id, data);

    return res.status(200).json({
      success: true,
      data: banner,
      message: 'Banner atualizado com sucesso',
    });
  }

  async list(req: Request, res: Response): Promise<Response> {
    const banners = await this.listBannersUseCase.execute();

    return res.status(200).json({
      success: true,
      data: banners,
      count: banners.length,
    });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const banner = await this.getBannerByIdUseCase.execute(id);

    return res.status(200).json({
      success: true,
      data: banner,
    });
  }

  async getByPosition(req: Request, res: Response): Promise<Response> {
    const { position } = req.params;
    const userRole = req.query.userRole as string;
    const banners = await this.getBannersByPositionUseCase.execute(position as any, userRole);

    return res.status(200).json({
      success: true,
      data: banners,
      count: banners.length,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.deleteBannerUseCase.execute(id);

    return res.status(200).json({
      success: true,
      message: 'Banner removido com sucesso',
    });
  }

  async incrementClick(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.incrementBannerClickUseCase.execute(id);

    return res.status(200).json({
      success: true,
      message: 'Clique registrado com sucesso',
    });
  }

  async incrementView(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.incrementBannerViewUseCase.execute(id);

    return res.status(200).json({
      success: true,
      message: 'Visualização registrada com sucesso',
    });
  }
}
