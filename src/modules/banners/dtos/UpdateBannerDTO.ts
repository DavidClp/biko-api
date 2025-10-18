import { BannerPosition, BannerSize, BannerPublicVisibility } from '@prisma/client';

export interface UpdateBannerDTO {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageFile?: Express.Multer.File;
  position?: BannerPosition;
  size?: BannerSize;
  isActive?: boolean;
  clickCount?: number;
  viewCount?: number;
  publicVisibility?: BannerPublicVisibility;
}
