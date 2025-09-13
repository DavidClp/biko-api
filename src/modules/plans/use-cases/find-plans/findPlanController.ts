import { Request, Response } from 'express';
import { FindPlanUseCase } from './FindPlanUseCase';
import { PrismaPlanRepository } from '../../repositories/implementations/PrismaPlanRepository';

export const findPlanController = async (request: Request, response: Response) => {
  const { id } = request.params;

  const repository = new PrismaPlanRepository();

  const useCase = new FindPlanUseCase(repository);

  const business = await useCase.execute({ id });

  return response.json(business);
};
