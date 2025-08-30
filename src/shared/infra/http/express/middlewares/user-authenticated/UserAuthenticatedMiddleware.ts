import { verify } from 'jsonwebtoken';
import { database } from '../../../../database';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../../../../errors/UnauthorizedError';
//import { IPermissionsTypes } from '../../../../../../modules/user-types/utils/permissions';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const userAuthenticatedMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError();
      }

      const token = authHeader.split(' ')[1];

      const decoded = verify(token, process.env.JWT_SECRET as string);

      const user_id = decoded.sub as string;

      const foundAdm = await database.user.findFirst({
        where: {
          id: user_id,
          deletedAt: null
        },
      });

      if (!foundAdm) {
        throw new UnauthorizedError();
      }

        //PERMISSOES
     /*  if (permissions.length > 0) {
        let hasPermission = false;

        if (permissions?.includes('ROOT')) {
          if (foundAdm?.is_root) {
            hasPermission = true;
          } else {
            if (permissions.length > 1) {
              permissions = permissions.filter((permission) => permission !== 'ROOT');
            }
          }
        }

        hasPermission = permissions.every((permission) => foundAdm?.user_type?.permissions?.includes(permission as any));

        if (foundAdm?.is_root) {
          hasPermission = true;
        }

        if (!hasPermission) throw new UnauthorizedError();
      }
 */

      req.user = { id: user_id };

      return next();
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return res.status(401).json({
          success: false,
          error: {
            title: 'Não autorizado',
            detail: 'Token inválido ou expirado',
            statusCode: 401,
          },
        });
      }
      
      // Se for outro tipo de erro, retornar erro interno
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado na autenticação',
          statusCode: 500,
        },
      });
    }
  };
};
