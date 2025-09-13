import { Request, Response } from "express";
import { getSubscriptionOfBusinessService } from "./getSubscriptionOfBusinessService";

export const GetSubscriptionOfBusinessControler = async (request: Request, res: Response) => {
    const provider_id = request.params.provider_id as string;

    if (!provider_id) {
        return res.status(400).send()
    }

    const subscription = await getSubscriptionOfBusinessService({ provider_id })

    return res.json(subscription)
}