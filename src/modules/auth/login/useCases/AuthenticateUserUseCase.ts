import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { database } from '../../../../shared/infra/database';
import { validateSubscriptionUseCase } from '@/modules/subscriptions-transactions-gerencianet/validateSubscription.service';
import AppError from '@/shared/errors/AppError';
import { correctSituations } from '@/shared/utils/correctSituations';

interface IAuthenticateUserRequest {
  email: string;
  password: string;
}

interface IAuthenticateUserResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    provider?: {
      id: string;
      name: string;
      services: string[];
      city?: string;
      status: string;
      photoUrl: string;
      subscription_situation: string;
      subscription_id: string;
    };
    client?: {
      id: string;
      name: string;
      city?: string;
    };
  };
  token: string;
}

export class AuthenticateUserUseCase {
  async execute({ email, password }: IAuthenticateUserRequest): Promise<IAuthenticateUserResponse> {
    const user = await database.user.findFirst({
      where: {
        email,
        deletedAt: null
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            service_provider: {
              select: {
                service: true
              }
            },
            subscriptions: {
              include: {
                transactions: true
              }
            },
            city: true,
            status: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos');
    }

    let subscription_situation: any = ""

    try {
      subscription_situation = await validateSubscriptionUseCase({ provider: user.provider })
    } catch (err) {
      if (err instanceof AppError) subscription_situation = correctSituations[err?.error?.field as unknown as string]
      else throw err
    }

    const token = sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d'
      }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        provider: user.provider ? {
          id: user.provider.id,
          subscription_situation: subscription_situation,
          subscription_id: user.provider?.subscriptions?.id || '',
          name: user.provider.name,
          services: user.provider.service_provider.map(sp => sp.service.id),
          city: user.provider.city?.name || undefined,
          status: user.provider.status,
          photoUrl: user.provider.photoUrl || ''
        } : undefined,
        client: user.client ? {
          id: user.client.id,
          name: user.client.name,
          city: user.client.city || undefined
        } : undefined
      },
      token
    };
  }
}
