import { Request, Response } from 'express';
import { PrismaPlanRepository } from '../../repositories/implementations/PrismaPlanRepository';
import { ListPlansUseCase } from './ListPlansUseCase';

export const listPlansController = async (request: Request, response: Response) => {
  const {
    limit,
    page,
    search,
  } = request.query as any;
  const repository = new PrismaPlanRepository();
  const useCase = new ListPlansUseCase(repository);

  const { count, data } = await useCase.execute({
    limit,
    page,
    search,
  });

  return response.json({ count, data });
};
