export interface GenerateRecommendationCodeDTO {
  cpf: string;
  pixKey: string;
}

export interface CreateRecommendationDTO {
  recommendationCode: string;
}

export interface RecommendationResponseDTO {
  id: string;
  giverId: string;
  receiverId: string;
  createdAt: Date;
  giver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
  };
  receiver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
  };
}

export interface UserRecommendationCodeDTO {
  id: string;
  email: string;
  recommendation_code: string | null;
  cpf: string | null;
  pix_key: string | null;
  role: string;
}
