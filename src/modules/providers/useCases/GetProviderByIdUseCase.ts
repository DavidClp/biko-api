import { IProviderRepository } from '../repositories';
import { ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { validateSubscriptionUseCase } from '@/modules/subscriptions-transactions-gerencianet/validateSubscription.service';
import { correctSituations } from '@/shared/utils/correctSituations';

export class GetProviderByIdUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute(providerId: string): Promise<ProviderResponseDTO> {
    if (!providerId) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do provider é obrigatório',
        origin: 'GetProviderByIdUseCase.execute',
        statusCode: 400,
      });
    }

    const provider = await this.providerRepository.findById(providerId);

    let subscription_situation: any = ""

    try {
      subscription_situation = await validateSubscriptionUseCase({ provider: provider })
    } catch (err) {
      if (err instanceof AppError) subscription_situation = correctSituations[err?.error?.field as unknown as string]
      else throw err
    }

    if (!provider) {
      throw new AppError({
        title: 'Provider não encontrado',
        detail: 'Provider com o ID especificado não foi encontrado',
        origin: 'GetProviderByIdUseCase.execute',
        statusCode: 404,
      });
    }

    return {
      ...provider,
      subscription_situation
    };
  }
}
