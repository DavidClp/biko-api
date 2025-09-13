import { validateSubscriptionUseCase } from "@/modules/subscriptions-transactions-gerencianet/validateSubscription.service";
import AppError from "../../../../shared/errors/AppError";
import { database } from "../../../../shared/infra/database";

interface IGetSubscriptionOfBusinessService {
    provider_id: string
}

export const getSubscriptionOfBusinessService = async (props: IGetSubscriptionOfBusinessService) => {
    const { provider_id } = props;

    const provider = await database.provider.findUnique({
        where: {
            id: provider_id
        },
        include: {
            subscriptions: {
                include: {
                    plans: true,
                    transactions: true
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
        const planFree = await database.plans.findFirst({
            where: {
                is_test_free: true,
            }
        })

        if(!planFree) return;

        provider.subscriptions = {
            plans: {
                ...planFree,
                permissions: planFree?.permissions as string[]
            },
            transactions: [],
        } as any
    }

    let subscription_situation: any = ""

    try {
        subscription_situation = await validateSubscriptionUseCase({ provider })
    } catch (err) {
        //@ts-ignore
        if (err instanceof AppError) subscription_situation = correctSituations[err.field as string]
        else throw err
    }

    const subscription: any = provider.subscriptions

    const transactions = await database.transactions.findMany(({
        where: {
            provider_id,
            subscription_id: {
                not: null
            }
        },
        include: {
            subscriptions: {
                include: {
                    plans: true
                }
            }
        }
    }))

    if (subscription) {
        subscription.situation = subscription_situation
        return { subscription, transactions }
    }
    else return subscription_situation
}