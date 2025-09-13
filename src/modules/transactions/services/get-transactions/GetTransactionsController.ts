import { Request, Response } from "express";
import { GetTransactionsUseCase } from "./GetTransactionsUseCase";

export const GetTransactionsController = async (req:Request,res:Response) => {
	const result = await GetTransactionsUseCase()
	return res.json(result)
}
    