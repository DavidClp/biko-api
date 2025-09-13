import { Request, Response } from "express";
import { CreateOrUpdateSubscriptionUseCase } from "./CreateOrUpdateSubscriptionUseCase";
import { PrismaPlanRepository } from "../../../plans/repositories/implementations/PrismaPlanRepository";
import { ProviderRepository } from "@/modules/providers";

export const CreateOrUpdateSubscriptionController = async (request: Request, res: Response): Promise<Response> => {
	const { plan_id, credit_card, banking_billet, provider_id } = request.body

	const planRepository = new PrismaPlanRepository();
	const providerRepository = new ProviderRepository();

	const useCase = new CreateOrUpdateSubscriptionUseCase(providerRepository, planRepository);

	try {
		const result = await useCase.execute({ provider_id, plan_id, banking_billet, credit_card })
		return res.json(result)
	} catch (err) {
		throw err
	}
}
