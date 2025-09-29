import { IAdminStatsDTO, IAdminAnalyticsDTO, IAdminProviderDTO, IAdminProviderFiltersDTO } from '../dtos'

export interface IAdminRepository {
  // Dashboard Stats
  getDashboardStats(): Promise<IAdminStatsDTO>
  
  // Analytics
  getAnalytics(filters: any): Promise<IAdminAnalyticsDTO>
  
  // Providers
  getProvidersWithDetails(filters?: IAdminProviderFiltersDTO): Promise<IAdminProviderDTO[]>
  getProviderByIdWithDetails(providerId: string): Promise<IAdminProviderDTO | null>
  toggleProviderListed(providerId: string, isListed: boolean): Promise<void>
  
  // Users
  getAllUsers(): Promise<any[]>
  getUserById(userId: string): Promise<any | null>
  
  // System Metrics
  getSystemMetrics(): Promise<{
    averageResponseTime: number
    totalRequests: number
    successRate: number
    activeUsers: number
  }>
}
