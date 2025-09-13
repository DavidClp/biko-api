import { Request, Response } from "express";
import { CancelSubscriptionUseCase } from "./CancelSubscriptionUseCase";

export const CancelSubscriptionController = async (req: Request, res: Response) => {
    const { subscription_id } = req.params

    try {
        const subscription = await CancelSubscriptionUseCase({ subscription_id, })

        return res.status(200).json(subscription)
    } catch (err) {
        throw err
    }
}