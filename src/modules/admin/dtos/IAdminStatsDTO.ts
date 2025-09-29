export interface IAdminStatsDTO {
  totalUsers: number
  totalProviders: number
  totalClients: number
  listedProviders: number
  providersWithSubscription: number
  monthlyRevenue: number
  pendingProviders: number
  thisMonthSignups: number
  topCities: Array<{
    city: string
    state: string
    count: number
  }>
  recentProviders: Array<{
    id: string
    name: string
    business_name?: string
    createdAt: string
    city?: {
      name: string
      state: {
        initials: string
      }
    }
    is_listed: boolean
  }>
}
