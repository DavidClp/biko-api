export interface IAdminAnalyticsDTO {
  userGrowth: Array<{
    month: string
    users: number
    providers: number
    clients: number
  }>
  revenue: Array<{
    month: string
    revenue: number
    subscriptions: number
  }>
  topServices: Array<{
    service: string
    count: number
    revenue: number
  }>
  geographicDistribution: Array<{
    state: string
    providers: number
    clients: number
  }>
  conversionRates: {
    signupToProvider: number
    providerToSubscription: number
    subscriptionToActive: number
  }
  systemMetrics: {
    averageResponseTime: number
    totalRequests: number
    successRate: number
    activeUsers: number
  }
}

export interface IAdminAnalyticsFiltersDTO {
  period?: '3m' | '6m' | '1y'
  startDate?: string
  endDate?: string
}
