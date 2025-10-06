import { Router } from "express";
import {
  requestPasswordRecoveryController,
  resetPasswordController,
} from "../index";

const passwordRecoveryRouter = Router();

passwordRecoveryRouter.post("/request", (request, response) => {
  return requestPasswordRecoveryController.handle(request, response);
});

passwordRecoveryRouter.post("/reset", (request, response) => {
  return resetPasswordController.handle(request, response);
});

export { passwordRecoveryRouter };


