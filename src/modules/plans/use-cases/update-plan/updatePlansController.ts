import { Request, Response } from 'express';
import { PrismaPlanRepository } from '../../repositories/implementations/PrismaPlanRepository';
import { UpdatePlanUseCase } from './UpdatePlanUseCase';

export const updatePlansController = async (request: Request, response: Response) => {
  const { id } = request.params;

  const {
    name,
    icon,
    value,
    recurrence,
    frequency,
    permissions,
    description,
    active,
    is_test_free
  } = request.body;

  const repository = new PrismaPlanRepository();

  const useCase = new UpdatePlanUseCase(repository);

  const business = await useCase.execute({
    id,
    name,
    icon,
    value,
    recurrence,
    frequency,
    permissions,
    description,
    active,
    is_test_free
  });

  return response.json(business);
};
