import { validateSubscriptionUseCase } from "@/modules/subscriptions-transactions-gerencianet/validateSubscription.service";
import AppError from "../../../../shared/errors/AppError";
import { database } from "../../../../shared/infra/database";
import { correctSituations } from "@/shared/utils/correctSituations";
import PlanFree from "@/shared/utils/PlanFree";

interface IGetSubscriptionPermissionsUseCase {
    provider_id: string
}

export const getSubscriptionPermissionsUseCase = async (props: IGetSubscriptionPermissionsUseCase) => {
    const { provider_id } = props;

    const provider = await database.provider.findUnique({
        where: {
            id: provider_id
        },
        include: {
            subscriptions: {
                include: {
                    plans: true,
                }
            }
        }
    })

    if (!provider) {
        throw new AppError({
            detail: 'provider not found',
            title: 'provider not found',
            statusCode: 404,
        });
    }

    if (!provider?.subscriptions) {
        const planFree = PlanFree

        provider.subscriptions = {
            plans: {
                permissions: planFree?.permissions as string[]
            }
        } as any
    }

    if (provider?.subscriptions) {
        return { permissions: provider?.subscriptions?.plans?.permissions, planName: provider?.subscriptions?.plans?.name }
    }

    else return { permissions: [], planName: 'PLANO GRATUITO' }
}