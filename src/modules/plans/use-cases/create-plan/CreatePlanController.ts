import { Request, Response } from 'express';
import { CreatePlanUseCase } from './CreatePlanUseCase';
import { PrismaPlanRepository } from '../../repositories/implementations/PrismaPlanRepository';

export const CreatePlanController = async (request: Request, response: Response) => {
  const {
    name,
    icon,
    value,
    frequency,
    permissions,
    description,
    recurrence
  } = request.body;

  const repository = new PrismaPlanRepository();

  const useCase = new CreatePlanUseCase(repository);

  const plan = await useCase.execute({
    name,
    icon,
    value,
    frequency,
    permissions,
    description,
    recurrence
  });

  return response.json(plan);
};
