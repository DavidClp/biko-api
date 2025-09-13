import { Request, Response } from "express";
import { GetTransactionsByIdUseCase } from "./GetTransactionsByIdUseCase";

export const GetTransactionsByIdController = async (req:Request,res:Response) => {
	const { id } = req.params
	const result = await GetTransactionsByIdUseCase(id)
	return res.json(result)
}
    