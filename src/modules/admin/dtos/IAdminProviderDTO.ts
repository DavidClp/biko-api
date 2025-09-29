export interface IAdminProviderDTO {
  id: string
  name: string
  business_name?: string
  description?: string
  phone?: string
  photoUrl?: string
  is_listed: boolean
  status: string
  createdAt: string
  user: {
    email: string
  }
  city?: {
    name: string
    state: {
      name: string
      initials: string
    }
  }
  subscriptions?: {
    id: string
    status: string
    value: number
    plans: {
      name: string
      description: string
    }
    next_execution?: string
    next_expire_at?: string
  }
  transactions: Array<{
    id: string
    value: number
    status: string
    type: string
    createdAt: string
    description: string
  }>
  service_provider: Array<{
    service: {
      name: string
    }
  }>
}

export interface IAdminProviderFiltersDTO {
  search?: string
  status?: string
  is_listed?: boolean
  city?: string
  service?: string
  limit?: number
  offset?: number
}

export interface IAdminToggleProviderListedDTO {
  providerId: string
  is_listed: boolean
}
