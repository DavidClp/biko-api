import { PrismaClient, Recommendation, User } from '@prisma/client';

const prisma = new PrismaClient();

export class RecommendationRepository {
  async createRecommendation(giverId: string, receiverId: string): Promise<Recommendation> {
    return await prisma.recommendation.create({
      data: {
        giverId,
        receiverId,
      },
      include: {
        giver: {
          select: {
            id: true,
            email: true,
            role: true,
            recommendation_code: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            role: true,
            recommendation_code: true,
          },
        },
      },
    });
  }

  async findRecommendationByCode(code: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        recommendation_code: code,
      },
      include: {
        client: true,
        provider: true,
      },
    });
  }

  async generateRecommendationCode(userId: string, cpf: string, pixKey: string): Promise<User> {
    // Gera um código único baseado no CPF e timestamp
    const timestamp = Date.now().toString().slice(-6);
    const code = `REC${cpf.slice(-4)}${timestamp}`;

    return await prisma.user.update({
      where: { id: userId },
      data: {
        recommendation_code: code,
        cpf,
        pix_key: pixKey,
      },
    });
  }

  async getUserRecommendations(userId: string): Promise<Recommendation[]> {
    return await prisma.recommendation.findMany({
      where: {
        giverId: userId,
      },
      include: {
        receiver: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                business_name: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkIfAlreadyRecommended(giverId: string, receiverId: string): Promise<boolean> {
    const recommendation = await prisma.recommendation.findUnique({
      where: {
        giverId_receiverId: {
          giverId,
          receiverId,
        },
      },
    });

    return !!recommendation;
  }

  async getUserByRecommendationCode(code: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        recommendation_code: code,
      },
      include: {
        client: true,
        provider: true,
      },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        client: true,
        provider: true,
      },
    });
  }

  async getAllRecommendations(page: number = 1, limit: number = 20, startDate?: Date, endDate?: Date): Promise<{
    recommendations: Recommendation[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = startDate;
      }
      if (endDate) {
        whereClause.createdAt.lte = endDate;
      }
    }

    const [recommendations, total] = await Promise.all([
      prisma.recommendation.findMany({
        where: whereClause,
        include: {
          giver: {
            select: {
              id: true,
              email: true,
              role: true,
              recommendation_code: true,
              cpf: true,
              pix_key: true,
            },
          },
          receiver: {
            select: {
              id: true,
              email: true,
              role: true,
              recommendation_code: true,
              provider: {
                select: {
                  id: true,
                  name: true,
                  business_name: true,
                  status: true,
                  city: {
                    select: {
                      name: true,
                      state: {
                        select: {
                          initials: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.recommendation.count({
        where: whereClause,
      }),
    ]);

    return {
      recommendations,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
