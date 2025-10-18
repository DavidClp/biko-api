import { Router } from 'express'
import { AdminController } from '../controllers'
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware'
import { database } from '@/shared/infra/database'

const adminRoutes = Router()
const adminController = new AdminController()

// Middleware para verificar se o usuário é admin
const adminMiddleware = async (req: any, res: any, next: any) => {
  const user = await database.user.findUnique({
    where: {
      id: req.user?.id as string
    }
  })

  if (user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: {
        title: 'Acesso negado',
        detail: 'Apenas administradores podem acessar esta rota',
        statusCode: 403
      }
    })
  }
  next()
}

// Analytics
adminRoutes.get('/analytics', userAuthenticatedMiddleware(), adminMiddleware, adminController.getAnalytics.bind(adminController))

// Providers
adminRoutes.get('/providers', userAuthenticatedMiddleware(), adminMiddleware, adminController.getProviders.bind(adminController))
adminRoutes.get('/providers/:providerId', userAuthenticatedMiddleware(), adminMiddleware, adminController.getProviderById.bind(adminController))
adminRoutes.patch('/providers/:providerId/toggle-listed', userAuthenticatedMiddleware(), adminMiddleware, adminController.toggleProviderListed.bind(adminController))

// Users
adminRoutes.get('/users', userAuthenticatedMiddleware(), adminMiddleware, adminController.getAllUsers.bind(adminController))
adminRoutes.get('/users/:id', userAuthenticatedMiddleware(), adminMiddleware, adminController.getUserById.bind(adminController))

export { adminRoutes }
