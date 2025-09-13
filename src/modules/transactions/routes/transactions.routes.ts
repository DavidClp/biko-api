import { userAuthenticatedMiddleware } from "../../../shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware";
import { Router } from "express";
import { GetTransactionsByIdController } from "../services/get-transaction-by-id/GetTransactionsByIdController";
import { GetTransactionsController } from "../services/get-transactions/GetTransactionsController";

const transactionsRouter = Router();

transactionsRouter.get('/', userAuthenticatedMiddleware(), GetTransactionsController);
transactionsRouter.get('/:id', userAuthenticatedMiddleware(), GetTransactionsByIdController);

export { transactionsRouter }
