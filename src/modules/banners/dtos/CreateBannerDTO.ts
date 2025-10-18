import { BannerPosition, BannerSize, BannerPublicVisibility } from '@prisma/client';

export interface CreateBannerDTO {
  advertiserId: string;
  title: string;
  description?: string;
  imageFile?: Express.Multer.File;
  imageUrl?: string;
  position: BannerPosition;
  size: BannerSize;
  isActive?: boolean;
  publicVisibility?: BannerPublicVisibility;
}
