export interface CreateProviderMetricDTO {
  provider_id: string;
  metric_type: 'SEARCH_APPEARANCE' | 'PROFILE_VIEW';
  metadata?: {
    query?: string;
    ip?: string;
    user_agent?: string;
    city_id?: string;
    services?: string[];
  };
}
