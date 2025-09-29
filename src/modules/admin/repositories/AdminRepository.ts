import { PrismaClient } from '@prisma/client'
import { IAdminRepository } from './IAdminRepository'
import { IAdminStatsDTO, IAdminAnalyticsDTO, IAdminProviderDTO, IAdminProviderFiltersDTO } from '../dtos'

export class AdminRepository implements IAdminRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getDashboardStats(): Promise<IAdminStatsDTO> {
    try {
      // Buscar dados básicos
      const [totalUsers, totalProviders, totalClients, subscriptions] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.provider.count(),
        this.prisma.client.count(),
        this.prisma.subscriptions.findMany({
          include: {
            plans: true
          }
        })
      ])

      // Buscar provedores com detalhes
      const providers = await this.prisma.provider.findMany({
        include: {
          user: true,
          city: {
            include: {
              state: true
            }
          },
          service_provider: {
            include: {
              service: true
            }
          }
        }
      })

      // Calcular estatísticas
      const listedProviders = providers.filter(p => p.is_listed).length
      const providersWithSubscription = subscriptions.length
      const monthlyRevenue = subscriptions.reduce((sum, sub) => sum + Number(sub.value), 0)
      const pendingProviders = providers.filter(p => p.status === 'PENDING').length

      // Provedores deste mês
      const thisMonth = new Date()
      thisMonth.setDate(1)
      const thisMonthSignups = providers.filter(p => new Date(p.createdAt) >= thisMonth).length

      // Top cidades
      const cityCounts: { [key: string]: { city: string, state: string, count: number } } = {}
      providers.forEach(provider => {
        if (provider.city) {
          const key = `${provider.city.name}-${provider.city.state.initials || ''}`
          if (cityCounts[key]) {
            cityCounts[key].count++
          } else {
            cityCounts[key] = {
              city: provider.city.name || '',
              state: provider.city.state.initials || '',
              count: 1
            }
          }
        }
      })
      const topCities = Object.values(cityCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Provedores recentes
      const recentProviders = providers
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          business_name: p.business_name || '',
          createdAt: p.createdAt.toISOString(),
          city: p.city ? {
            name: p.city.name || '',
            state: {
              initials: p.city.state.initials || ''
            }
          } : undefined,
          is_listed: p.is_listed
        }))

      return {
        totalUsers,
        totalProviders,
        totalClients,
        listedProviders,
        providersWithSubscription,
        monthlyRevenue,
        pendingProviders,
        thisMonthSignups,
        topCities,
        recentProviders
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error)
      throw new Error('Erro ao buscar estatísticas do dashboard')
    }
  }

  async getAnalytics(filters: any): Promise<IAdminAnalyticsDTO> {
    try {
      // Buscar dados para analytics
      const [providers, clients, subscriptions, transactions] = await Promise.all([
        this.prisma.provider.findMany({
          include: {
            service_provider: {
              include: {
                service: true
              }
            },
            city: {
              include: {
                state: true
              }
            }
          }
        }),
        this.prisma.client.findMany(),
        this.prisma.subscriptions.findMany({
          include: {
            plans: true
          }
        }),
        this.prisma.transactions.findMany()
      ])

      // Calcular crescimento de usuários por mês
      const userGrowth = this.calculateUserGrowth(providers, clients)
      
      // Calcular receita por mês
      const revenue = this.calculateMonthlyRevenue(transactions, subscriptions)
      
      // Top serviços
      const topServices = this.calculateTopServices(providers, subscriptions)
      
      // Distribuição geográfica
      const geographicDistribution = this.calculateGeographicDistribution(providers, clients)
      
      // Taxas de conversão
      const conversionRates = this.calculateConversionRates(providers, subscriptions)
      
      // Métricas do sistema
      const systemMetrics = await this.getSystemMetrics()

      return {
        userGrowth,
        revenue,
        topServices,
        geographicDistribution,
        conversionRates,
        systemMetrics
      }
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
      throw new Error('Erro ao buscar analytics')
    }
  }

  async getProvidersWithDetails(filters?: IAdminProviderFiltersDTO): Promise<IAdminProviderDTO[]> {
    try {
      const where: any = {}

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { business_name: { contains: filters.search, mode: 'insensitive' } },
          { user: { email: { contains: filters.search, mode: 'insensitive' } } }
        ]
      }

      if (filters?.status) {
        where.status = filters.status
      }

      if (filters?.is_listed !== undefined) {
        where.is_listed = filters.is_listed
      }

      if (filters?.city) {
        where.city = {
          name: { contains: filters.city, mode: 'insensitive' }
        }
      }

      const providers = await this.prisma.provider.findMany({
        where,
        include: {
          user: true,
          city: {
            include: {
              state: true
            }
          },
          service_provider: {
            include: {
              service: true
            }
          },
          subscriptions: {
            include: {
              plans: true
            }
          },
          transactions: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: filters?.limit || 50,
        skip: filters?.offset || 0
      })

      return providers.map(provider => ({
        id: provider.id,
        name: provider.name,
        business_name: provider.business_name || '',
        description: provider.description || '',
        phone: provider.phone || '',
        photoUrl: provider.photoUrl || '',
        is_listed: provider.is_listed,
        status: provider.status,
        createdAt: provider.createdAt.toISOString(),
        user: {
          email: provider.user.email
        },
        city: provider.city ? {
          name: provider.city.name || '',
          state: {
            name: provider.city.state.name || '',
            initials: provider.city.state.initials || ''
          }
        } : undefined,
        subscriptions: provider.subscriptions ? {
          id: provider.subscriptions.id,
          status: provider.subscriptions.status,
          value: Number(provider.subscriptions.value),
          plans: {
            name: provider.subscriptions.plans.name,
            description: provider.subscriptions.plans.description || ''
          },
          next_execution: provider.subscriptions.next_execution || undefined,
          next_expire_at: provider.subscriptions.next_expire_at || undefined
        } : undefined,
        transactions: provider.transactions.map(transaction => ({
          id: transaction.id,
          value: Number(transaction.value),
          status: transaction.status,
          type: transaction.type,
          createdAt: transaction.createdAt.toISOString(),
          description: transaction.description
        })),
        service_provider: provider.service_provider.map(sp => ({
          service: {
            name: sp.service.name
          }
        }))
      }))
    } catch (error) {
      console.error('Erro ao buscar provedores:', error)
      throw new Error('Erro ao buscar provedores')
    }
  }

  async getProviderByIdWithDetails(providerId: string): Promise<IAdminProviderDTO | null> {
    try {
      const provider = await this.prisma.provider.findUnique({
        where: { id: providerId },
        include: {
          user: true,
          city: {
            include: {
              state: true
            }
          },
          service_provider: {
            include: {
              service: true
            }
          },
          subscriptions: {
            include: {
              plans: true
            }
          },
          transactions: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })

      if (!provider) return null

      return {
        id: provider.id,
        name: provider.name,
        business_name: provider.business_name || '',
        description: provider.description || '',
        phone: provider.phone || '',
        photoUrl: provider?.photoUrl || '',
        is_listed: provider.is_listed,
        status: provider.status,
        createdAt: provider.createdAt.toISOString(),
        user: {
          email: provider.user.email
        },
        city: provider.city ? {
          name: provider.city.name || '',
          state: {
            name: provider.city.state.name || '',
            initials: provider.city.state.initials || ''
          }
        } : undefined,
        subscriptions: provider.subscriptions ? {
          id: provider.subscriptions.id,
          status: provider.subscriptions.status,
          value: Number(provider.subscriptions.value),
          plans: {
            name: provider.subscriptions.plans.name,
            description: provider.subscriptions.plans.description
          },
          next_execution: provider.subscriptions.next_execution || undefined,
          next_expire_at: provider.subscriptions.next_expire_at || undefined
        } : undefined,
        transactions: provider.transactions.map(transaction => ({
          id: transaction.id,
          value: Number(transaction.value),
          status: transaction.status,
          type: transaction.type,
          createdAt: transaction.createdAt.toISOString(),
          description: transaction.description
        })),
        service_provider: provider.service_provider.map(sp => ({
          service: {
            name: sp.service.name
          }
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar provedor:', error)
      throw new Error('Erro ao buscar provedor')
    }
  }

  async toggleProviderListed(providerId: string, isListed: boolean): Promise<void> {
    try {
      await this.prisma.provider.update({
        where: { id: providerId },
        data: { is_listed: isListed }
      })
    } catch (error) {
      console.error('Erro ao atualizar provedor:', error)
      throw new Error('Erro ao atualizar provedor')
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          client: true,
          provider: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return users
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw new Error('Erro ao buscar usuários')
    }
  }

  async getUserById(userId: string): Promise<any | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          client: true,
          provider: true
        }
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      throw new Error('Erro ao buscar usuário')
    }
  }

  async getSystemMetrics(): Promise<{
    averageResponseTime: number
    totalRequests: number
    successRate: number
    activeUsers: number
  }> {
    try {
      // Métricas simuladas por enquanto
      // Em produção, essas métricas viriam de um sistema de monitoramento
      return {
        averageResponseTime: 245,
        totalRequests: 125430,
        successRate: 99.7,
        activeUsers: await this.prisma.user.count()
      }
    } catch (error) {
      console.error('Erro ao buscar métricas do sistema:', error)
      throw new Error('Erro ao buscar métricas do sistema')
    }
  }

  // Métodos auxiliares privados
  private calculateUserGrowth(providers: any[], clients: any[]): Array<{
    month: string
    users: number
    providers: number
    clients: number
  }> {
    const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      const monthDate = new Date()
      monthDate.setMonth(currentMonth - (5 - index))
      
      const monthProviders = providers.filter(p => {
        const providerDate = new Date(p.createdAt)
        return providerDate.getMonth() === monthDate.getMonth() && 
               providerDate.getFullYear() === monthDate.getFullYear()
      })
      
      const monthClients = clients.filter(c => {
        const clientDate = new Date(c.createdAt)
        return clientDate.getMonth() === monthDate.getMonth() && 
               clientDate.getFullYear() === monthDate.getFullYear()
      })
      
      return {
        month,
        users: monthProviders.length + monthClients.length,
        providers: monthProviders.length,
        clients: monthClients.length
      }
    })
  }

  private calculateMonthlyRevenue(transactions: any[], subscriptions: any[]): Array<{
    month: string
    revenue: number
    subscriptions: number
  }> {
    const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      const monthDate = new Date()
      monthDate.setMonth(currentMonth - (5 - index))
      
      const monthTransactions = transactions.filter(t => {
        const transDate = new Date(t.createdAt)
        return transDate.getMonth() === monthDate.getMonth() && 
               transDate.getFullYear() === monthDate.getFullYear()
      })
      
      const monthRevenue = monthTransactions.reduce((sum, t) => sum + Number(t.value), 0)
      
      return {
        month,
        revenue: monthRevenue,
        subscriptions: monthTransactions.length
      }
    })
  }

  private calculateTopServices(providers: any[], subscriptions: any[]): Array<{
    service: string
    count: number
    revenue: number
  }> {
    const serviceCounts: { [key: string]: { count: number, revenue: number } } = {}
    
    providers.forEach(provider => {
      provider.service_provider?.forEach((sp: any) => {
        const serviceName = sp.service.name
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName].count++
        } else {
          serviceCounts[serviceName] = { count: 1, revenue: 0 }
        }
      })
    })
    
    // Calcular receita por serviço baseado nas assinaturas
    subscriptions.forEach(sub => {
      const serviceNames = Object.keys(serviceCounts)
      const revenuePerService = Number(sub.value) / serviceNames.length
      serviceNames.forEach(serviceName => {
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName].revenue += revenuePerService
        }
      })
    })
    
    return Object.entries(serviceCounts)
      .map(([service, data]) => ({
        service,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  private calculateGeographicDistribution(providers: any[], clients: any[]): Array<{
    state: string
    providers: number
    clients: number
  }> {
    const stateCounts: { [key: string]: { providers: number, clients: number } } = {}
    
    providers.forEach(provider => {
      if (provider.city?.state) {
        const state = provider.city.state.initials
        if (stateCounts[state]) {
          stateCounts[state].providers++
        } else {
          stateCounts[state] = { providers: 1, clients: 0 }
        }
      }
    })
    
    // Para clientes, assumindo que temos informação de estado
    // Por enquanto, distribuir igualmente entre os estados existentes
    const states = Object.keys(stateCounts)
    states.forEach(state => {
      stateCounts[state].clients = Math.floor(clients.length / states.length)
    })
    
    return Object.entries(stateCounts)
      .map(([state, data]) => ({
        state,
        providers: data.providers,
        clients: data.clients
      }))
      .sort((a, b) => b.providers - a.providers)
      .slice(0, 5)
  }

  private calculateConversionRates(providers: any[], subscriptions: any[]): {
    signupToProvider: number
    providerToSubscription: number
    subscriptionToActive: number
  } {
    const totalUsers = providers.length + (providers.length * 0.5) // Assumindo proporção
    const signupToProvider = (providers.length / totalUsers) * 100
    const providerToSubscription = (subscriptions.length / providers.length) * 100
    const subscriptionToActive = (subscriptions.filter((s: any) => s.status === 'ACTIVE').length / subscriptions.length) * 100
    
    return {
      signupToProvider: Math.round(signupToProvider * 10) / 10,
      providerToSubscription: Math.round(providerToSubscription * 10) / 10,
      subscriptionToActive: Math.round(subscriptionToActive * 10) / 10
    }
  }
}
