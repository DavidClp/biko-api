export interface ProviderMetricsResponseDTO {
  total_search_appearances: number;
  total_profile_views: number;
  search_appearances_today: number;
  profile_views_today: number;
  search_appearances_this_week: number;
  profile_views_this_week: number;
  search_appearances_this_month: number;
  profile_views_this_month: number;
  daily_metrics: {
    date: string;
    search_appearances: number;
    profile_views: number;
  }[];
}
