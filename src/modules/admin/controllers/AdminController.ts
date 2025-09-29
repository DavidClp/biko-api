import { Request, Response } from 'express'
import {
  GetDashboardStatsUseCase,
  GetAnalyticsUseCase,
  GetProvidersUseCase,
  GetProviderByIdUseCase,
  ToggleProviderListedUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase
} from '../useCases'
import { AdminRepository } from '../repositories'
import { IAdminProviderFiltersDTO, IAdminAnalyticsFiltersDTO, IAdminToggleProviderListedDTO } from '../dtos'
import AppError from '../../../shared/errors/AppError'

export class AdminController {
  private getDashboardStatsUseCase: GetDashboardStatsUseCase
  private getAnalyticsUseCase: GetAnalyticsUseCase
  private getProvidersUseCase: GetProvidersUseCase
  private getProviderByIdUseCase: GetProviderByIdUseCase
  private toggleProviderListedUseCase: ToggleProviderListedUseCase
  private getAllUsersUseCase: GetAllUsersUseCase
  private getUserByIdUseCase: GetUserByIdUseCase

  constructor() {
    const adminRepository = new AdminRepository()

    this.getDashboardStatsUseCase = new GetDashboardStatsUseCase(adminRepository)
    this.getAnalyticsUseCase = new GetAnalyticsUseCase(adminRepository)
    this.getProvidersUseCase = new GetProvidersUseCase(adminRepository)
    this.getProviderByIdUseCase = new GetProviderByIdUseCase(adminRepository)
    this.toggleProviderListedUseCase = new ToggleProviderListedUseCase(adminRepository)
    this.getAllUsersUseCase = new GetAllUsersUseCase(adminRepository)
    this.getUserByIdUseCase = new GetUserByIdUseCase(adminRepository)
  }

  async getDashboardStats(req: Request, res: Response): Promise<Response> {
    try {
      const stats = await this.getDashboardStatsUseCase.execute()

      return res.status(200).json({
        success: true,
        data: stats,
        message: 'Estatísticas do dashboard obtidas com sucesso'
      })
    } catch (error) {
      console.error('Erro no controller getDashboardStats:', error)
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: error instanceof Error ? error.message : 'Erro desconhecido',
          statusCode: 500
        }
      })
    }
  }

  async getAnalytics(req: Request, res: Response): Promise<Response> {
    try {
      const filters: IAdminAnalyticsFiltersDTO = {
        period: req.query.period as '3m' | '6m' | '1y',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string
      }

      const analytics = await this.getAnalyticsUseCase.execute(filters)

      return res.status(200).json({
        success: true,
        data: analytics,
        message: 'Analytics obtidos com sucesso'
      })
    } catch (error) {
      console.error('Erro no controller getAnalytics:', error)
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: error instanceof Error ? error.message : 'Erro desconhecido',
          statusCode: 500
        }
      })
    }
  }

  async getProviders(req: Request, res: Response): Promise<Response> {
    try {
      const filters: IAdminProviderFiltersDTO = {
        search: req.query.search as string,
        status: req.query.status as string,
        is_listed: req.query.is_listed === 'true' ? true : req.query.is_listed === 'false' ? false : undefined,
        city: req.query.city as string,
        service: req.query.service as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      }

      const providers = await this.getProvidersUseCase.execute(filters)

      return res.status(200).json({
        success: true,
        data: providers,
        count: providers.length,
        message: 'Provedores obtidos com sucesso'
      })
    } catch (error) {
      console.error('Erro no controller getProviders:', error)
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: error instanceof Error ? error.message : 'Erro desconhecido',
          statusCode: 500
        }
      })
    }
  }

  async getProviderById(req: Request, res: Response): Promise<Response> {
    try {
      const { providerId } = req.params

      if (!providerId) {
        return res.status(400).json({
          success: false,
          error: {
            title: 'ID do provedor é obrigatório',
            detail: 'O parâmetro providerId é obrigatório',
            statusCode: 400
          }
        })
      }

      const provider = await this.getProviderByIdUseCase.execute(providerId)

      if (!provider) {
        return res.status(404).json({
          success: false,
          error: {
            title: 'Provedor não encontrado',
            detail: 'Provedor com o ID informado não foi encontrado',
            statusCode: 404
          }
        })
      }

      return res.status(200).json({
        success: true,
        data: provider,
        message: 'Provedor obtido com sucesso'
      })
    } catch (error) {
      console.error('Erro no controller getProviderById:', error)
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: error instanceof Error ? error.message : 'Erro desconhecido',
          statusCode: 500
        }
      })
    }
  }

  async toggleProviderListed(req: Request, res: Response): Promise<Response> {
    try {
      const { providerId } = req.params
      const { is_listed } = req.body

      if (!providerId) {
        return res.status(400).json({
          success: false,
          error: {
            title: 'ID do provedor é obrigatório',
            detail: 'O parâmetro providerId é obrigatório',
            statusCode: 400
          }
        })
      }

      if (typeof is_listed !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: {
            title: 'Valor inválido',
            detail: 'O campo is_listed deve ser um boolean',
            statusCode: 400
          }
        })
      }

      const data: IAdminToggleProviderListedDTO = {
        providerId,
        is_listed
      }

      await this.toggleProviderListedUseCase.execute(data)

      return res.status(200).json({
        success: true,
        message: 'Status de visibilidade do provedor atualizado com sucesso'
      })
    } catch (error) {
      console.error('Erro no controller toggleProviderListed:', error)
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: error instanceof Error ? error.message : 'Erro desconhecido',
          statusCode: 500
        }
      })
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.getAllUsersUseCase.execute()

      return res.status(200).json({
        success: true,
        data: users,
        count: users.length,
        message: 'Usuários obtidos com sucesso'
      })
    } catch (error) {
      console.error('Erro no controller getAllUsers:', error)
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: error instanceof Error ? error.message : 'Erro desconhecido',
          statusCode: 500
        }
      })
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const user = await this.getUserByIdUseCase.execute(id)

      if (!user) {
        throw new AppError({
          title: 'Usuário não encontrado',
          detail: 'O usuário com o ID fornecido não foi encontrado',
          statusCode: 404,
        })
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Usuário obtido com sucesso'
      })
    } catch (error) {
      console.error('Erro no controller getUserById:', error)
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          error: {
            title: error.error.title,
            detail: error.error.detail,
            statusCode: error.error.statusCode
          }
        })
      }
      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Erro ao buscar usuário',
          statusCode: 500
        }
      })
    }
  }
}
