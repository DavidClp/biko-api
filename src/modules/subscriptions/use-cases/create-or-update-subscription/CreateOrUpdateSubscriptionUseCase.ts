import AppError from "../../../../shared/errors/AppError";
import { database } from "../../../../shared/infra/database";
import { IPlanDTO } from "../../../plans/dtos/IPlanDTO";
import { generateId } from "../../../../shared/utils/generateId";
import { IBankingBillet, ICreditCard } from "@/shared/utils/gerencianet/IPaymentGatewayHelper";
import { IProviderRepository } from "@/modules/providers";
import { cancelSubscriptionInGerencianet, createSubscriptionInGerencianet, getDetailsOfSubscriptionInGerencianet } from "@/shared/utils/gerencianet/subscriptions";
import { importSubscriptionOfGerencianetService } from "@/modules/subscriptions-transactions-gerencianet/importSubscriptionOfGerencianet.service";
import { IProviderResponseDTO } from "@/modules/providers/dtos/IProviderResponseDTO";
import { IPlanRepository } from "@/modules/plans/repositories/IPlanRepository";

interface ICreateOrUpdateSubscriptionService {
	provider_id: string
	plan_id: string
	credit_card?: ICreditCard
	banking_billet?: IBankingBillet
}

export class CreateOrUpdateSubscriptionUseCase {
	constructor(
		private readonly providerRepository: IProviderRepository,
		private readonly planRepository: IPlanRepository,
	) { }

	async execute(data: ICreateOrUpdateSubscriptionService) {
		const { plan_id, provider_id, credit_card, banking_billet } = data;

		const [provider, plan] = await Promise.all([
			this.providerRepository.findById(provider_id),
			this.planRepository.find({ id: plan_id }),
		])

		this.validateData({provider, plan});

		const oldSubscriptionId = provider?.subscription_id;

		const totalValueforSubscription = Number(plan?.value ?? 0);

		let newSubscriptionData: any = {
			gateway_id: null,
			plan_id,
			status: 'active',
			value: totalValueforSubscription,
			card_mask: '-',
			card_flag: '-',
			banking_billet_info: banking_billet
		};

		const planIsFree = Number(totalValueforSubscription) <= 0;

		if (!planIsFree) {
			console.log("AQUII",banking_billet, totalValueforSubscription)
			const { gateway_id, status } = await createSubscriptionInGerencianet({ plan_id, credit_card, banking_billet, totalValueforSubscription });
			
			console.log('gateway_id', gateway_id)
			newSubscriptionData = {
				gateway_id,
				plan_id,
				status,
				value: totalValueforSubscription,
				card_mask: credit_card?.card_mask || '-',
				card_flag: credit_card?.card_flag || '-',
				banking_billet_info: banking_billet
			};
		}

		const newSubscription = await database.subscriptions.create({
			data: newSubscriptionData,
		});

		await database.provider.update({
			data: { 
				subscription_id: newSubscription.id,
			 },
			where: { id: provider?.id },
		});

		let transaction_id: string | undefined = undefined;

		if (!planIsFree) {
			const subscription_gateway_id = newSubscription.gateway_id;
			const result = await importSubscriptionOfGerencianetService({ subscription_gateway_id: subscription_gateway_id as number });

			transaction_id = result?.transaction_id;
		} else {
			const newTransaction = await database.transactions.create({
				data: {
					subscription_id: newSubscription.id,
					gateway_id: null,
					status: 'paid',
					description: 'Pagamento de assinatura',
					type: 'increase',
					value: 0,
					provider_id: provider?.id,
					method: 'free',
					card_flag: '-',
					card_mask: '-',
					friendly_id: generateId(6),
				},
			});
			transaction_id = newTransaction.id;
		}

		if (oldSubscriptionId) {
			const subscription = await database.subscriptions.findUnique({ where: { id: oldSubscriptionId } });

			if (!subscription) {
				throw new AppError({
					title: 'Subscription not found',
					detail: 'Subscription not found',
					statusCode: 404,
				});
			}

			if (subscription.gateway_id) {
				const { status } = await getDetailsOfSubscriptionInGerencianet(subscription.gateway_id);
				if (["new", "active"].includes(status)) {
					await cancelSubscriptionInGerencianet(subscription.gateway_id);
				}
			}

			await database.subscriptions.update({
				data: { status: 'canceled' },
				where: { id: subscription.id },
			});
		}

		return { ...newSubscription, plan: plan, transaction_id };
	}

	private validateData({provider, plan}: {provider: IProviderResponseDTO | null, plan: IPlanDTO | null}) {
		if (!provider) {
			throw new AppError({
				title: 'Provider not found',
				detail: 'Provider not found',
				statusCode: 404,
			});
		}
		
		if (!plan) {
			throw new AppError({
				title: 'Plan not found',
				detail: 'Plan not found',
				statusCode: 404,
			});
		}
	}
}