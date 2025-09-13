import AppError from "@/shared/errors/AppError"
import { transactionsAttributes } from "../shared/interfaces"

interface IValidateSubscriptionService {
    provider?: any
}

const NOT_PAID = { message: "Franchise subscription not paid", status: 402, path: "subscription-not-paid", entity: null }

const WAITING_BLOCK = { message: "Franchise subscription not paid", status: 402, path: "subscription-waiting-block", entity: null }

const PROVIDER_NOT_FOUND = { message: "Provider not found", status: 404, path: '', entity: '' }

const NOT_HAVE_SUBSCRIPTION = { message: "Provider not have subscription", status: 402, path: "not-have-subscription", entity: null }

const NOT_HAVE_TRANSACTIONS = { message: "Provider not have transactions", status: 402, path: "not-have-transactions", entity: null }

const SUBSCRIPTION_CANCELED = { message: "Provider subscription canceled", status: 402, path: "subscription-canceled", entity: null }

const SUBSCRIPTION_EXPIRED = { message: "Provider subscription expired", status: 402, path: "subscription-expired", entity: null }

const PAID_STATUS = ["paid", "settled", "paid-free"]

const DELINQUENT_AVAILABLE_STATUS = ["new", "waiting", "link", "paid", "settled", "paid-free", "unpaid", "identified", "approved"]

export const isBiggerThan = (date1: Date, date2: Date, limit: number) => {
    const diff = date1.getTime() - date2.getTime();
    const diffDays = diff / (1000 * 3600 * 24);
    return diffDays > limit;
};


export const validateSubscriptionUseCase = async (props: IValidateSubscriptionService) => {
    let { provider } = props

    const transactions: any = provider?.subscriptions?.transactions?.sort((a: any, b: any) => {
        const date_a = new Date(a.createdAt)
        const date_b = new Date(b.createdAt)
        return date_a.getTime() < date_b.getTime() ? 1 : -1
    }) as transactionsAttributes[]

    const subscription = provider?.subscriptions

    if (!provider) {
        throw new AppError({
            detail: PROVIDER_NOT_FOUND.message,
            title: PROVIDER_NOT_FOUND.message,
            statusCode: PROVIDER_NOT_FOUND.status,
            field: PROVIDER_NOT_FOUND.path
        });
    }

    if (!subscription) {
        throw new AppError({
            detail: NOT_HAVE_SUBSCRIPTION.message,
            title: NOT_HAVE_SUBSCRIPTION.message,
            statusCode: NOT_HAVE_SUBSCRIPTION.status,
            field: NOT_HAVE_SUBSCRIPTION.path
        });
    }

    if (!transactions || transactions?.length === 0) {
        throw new AppError({
            detail: NOT_HAVE_TRANSACTIONS.message,
            title: NOT_HAVE_TRANSACTIONS.message,
            statusCode: NOT_HAVE_TRANSACTIONS.status,
            field: NOT_HAVE_TRANSACTIONS.path
        });
    }

    if ("canceled" === subscription?.status) {
        throw new AppError({
            detail: SUBSCRIPTION_CANCELED.message,
            title: SUBSCRIPTION_CANCELED.message,
            statusCode: SUBSCRIPTION_CANCELED.status,
            field: SUBSCRIPTION_CANCELED.path
        });
    }

    if ("expired" === subscription?.status) {
        throw new AppError({
            detail: SUBSCRIPTION_EXPIRED.message,
            title: SUBSCRIPTION_EXPIRED.message,
            statusCode: SUBSCRIPTION_EXPIRED.status,
            field: SUBSCRIPTION_EXPIRED.path
        });
    }

    if (!DELINQUENT_AVAILABLE_STATUS.includes(transactions[0].status)) {
        throw new AppError({
            detail: NOT_PAID.message,
            title: NOT_PAID.message,
            statusCode: NOT_PAID.status,
            field: NOT_PAID.path
        });
    }

    if (!PAID_STATUS.includes(transactions[0].status)) {
        if (transactions.length === 1) {
            throw new AppError({
                detail: WAITING_BLOCK.message,
                title: WAITING_BLOCK.message,
                statusCode: WAITING_BLOCK.status,
                field: WAITING_BLOCK.path
            });
        }
        else {
            const last_transaction_paid = transactions.find((item: any) => PAID_STATUS.includes(item.status))
            if (!last_transaction_paid) {
                throw new AppError({
                    detail: WAITING_BLOCK.message,
                    title: WAITING_BLOCK.message,
                    statusCode: WAITING_BLOCK.status,
                    field: WAITING_BLOCK.path
                });
            }
            else {
                const atual_date = new Date()
                const atual_month = atual_date.getMonth()

                const last_transaction_paid_date = new Date(last_transaction_paid.createdAt as Date)
                const last_transaction_paid_month = last_transaction_paid_date.getMonth()

                if ((atual_month - last_transaction_paid_month) > 1) {
                    throw new AppError({
                        detail: WAITING_BLOCK.message,
                        title: WAITING_BLOCK.message,
                        statusCode: WAITING_BLOCK.status,
                        field: WAITING_BLOCK.path
                    });
                }
                else {
                    const transaction_created_at = new Date(transactions[0].createdAt as Date)

                    if (isBiggerThan(atual_date, transaction_created_at, 7)) {
                        throw new AppError({
                            detail: WAITING_BLOCK.message,
                            title: WAITING_BLOCK.message,
                            statusCode: WAITING_BLOCK.status,
                            field: WAITING_BLOCK.path
                        });
                    } else {
                        return "waiting-alert"
                    }
                }
            }
        }
        return "waiting"
    } else {
        const transaction_created_at = new Date(transactions[0].createdAt as Date)
        const atual_date = new Date()

        const plan_is_test_free = transactions[0].status === "paid-free"

        if (plan_is_test_free) {
            if (isBiggerThan(atual_date, transaction_created_at, 7)) {
                throw new AppError({
                    detail: NOT_PAID.message,
                    title: NOT_PAID.message,
                    statusCode: NOT_PAID.status,
                    field: NOT_PAID.path
                });
            }
            else return "paid-free"
        }

        const plan_is_free = (provider?.subscription?.plan?.value ?? 0) > 0 ? false : true
        if (plan_is_free) return "paid"

        if (isBiggerThan(atual_date, transaction_created_at, 32)) {
            throw new AppError({
                detail: NOT_PAID.message,
                title: NOT_PAID.message,
                statusCode: NOT_PAID.status,
                field: NOT_PAID.path
            });
        }
        else return "paid"
    }
}