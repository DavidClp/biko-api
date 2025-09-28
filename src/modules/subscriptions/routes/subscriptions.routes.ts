import { Router } from "express";
import { userAuthenticatedMiddleware } from "../../../shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware";
import { CreateOrUpdateSubscriptionController } from "../use-cases/create-or-update-subscription/CreateOrUpdateSubscriptionController";
import { GetSubscriptionOfBusinessControler } from "../use-cases/get-subscription-of-business/GetSubscriptionOfBusinessControler";
import { CancelSubscriptionController } from "../use-cases/cancel-subscription/CancelSubscriptionController";
import { GetSubscriptionPermissionsController } from "../use-cases/get-subscription-permissions/GetSubscriptionPermissionsController";

const subscriptionsRouter = Router();

subscriptionsRouter.post('/', userAuthenticatedMiddleware(), CreateOrUpdateSubscriptionController);
subscriptionsRouter.get('/',  userAuthenticatedMiddleware(), GetSubscriptionOfBusinessControler);
subscriptionsRouter.post('/cancel/:subscription_id', userAuthenticatedMiddleware(), CancelSubscriptionController);
subscriptionsRouter.get('/permissions', userAuthenticatedMiddleware(), GetSubscriptionPermissionsController);

export { subscriptionsRouter }