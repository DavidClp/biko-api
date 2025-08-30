import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { database } from '../../../../shared/infra/database';

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
      service: string;
      city: string;
      status: string;
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
            service: true,
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
        provider: user.provider || undefined,
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
