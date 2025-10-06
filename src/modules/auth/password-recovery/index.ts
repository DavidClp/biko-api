import { RequestPasswordRecoveryUseCase } from "./useCases/RequestPasswordRecoveryUseCase";
import { ResetPasswordUseCase } from "./useCases/ResetPasswordUseCase";
import { RequestPasswordRecoveryController } from "./controllers/RequestPasswordRecoveryController";
import { ResetPasswordController } from "./controllers/ResetPasswordController";

const requestPasswordRecoveryUseCase = new RequestPasswordRecoveryUseCase();
const resetPasswordUseCase = new ResetPasswordUseCase();

const requestPasswordRecoveryController =
  new RequestPasswordRecoveryController(requestPasswordRecoveryUseCase);
const resetPasswordController = new ResetPasswordController(
  resetPasswordUseCase
);

export { requestPasswordRecoveryController, resetPasswordController };


