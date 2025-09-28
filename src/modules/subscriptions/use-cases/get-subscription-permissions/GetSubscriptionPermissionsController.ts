import { Request, Response } from "express";
import { getSubscriptionPermissionsUseCase } from "./getSubscriptionPermissionsUseCase";

export const GetSubscriptionPermissionsController = async (request: Request, res: Response) => {
    const provider_id = request.query.provider_id as string;

    if (!provider_id) {
        return res.status(400).send()
    }

    const result = await getSubscriptionPermissionsUseCase({ provider_id })

    return res.json(result)
}