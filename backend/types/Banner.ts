// src/types/Banner.ts

export interface Banner {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  ctaButtonText: string;
  ctaButtonLink?: string;
  startDate: string;
  endDate: string;
  position: 'Home Page Only' | 'Product Page' | 'Both';
  bannerType: 'Normal' | 'Festival' | 'Flash Sale' | 'Seasonal';
  priority: number;
  status: 'Active' | 'Inactive' | 'Scheduled';
  backgroundColor?: string;
  textColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerResponse {
  success: boolean;
  data: Banner[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BannerStats {
  total: number;
  active: number;
  inactive: number;
  scheduled: number;
  byType: {
    normal: number;
    festival: number;
    flashSale: number;
    seasonal: number;
  };
  byPosition: {
    homePage: number;
    productPage: number;
    both: number;
  };
}

export interface CreateBannerData {
  title: string;
  description?: string;
  ctaButtonText: string;
  ctaButtonLink?: string;
  startDate: string;
  endDate: string;
  position: 'Home Page Only' | 'Product Page' | 'Both';
  bannerType: 'Normal' | 'Festival' | 'Flash Sale' | 'Seasonal';
  priority: number;
  status: 'Active' | 'Inactive' | 'Scheduled';
  backgroundColor?: string;
  textColor?: string;
}

export interface UpdateBannerData extends Partial<CreateBannerData> {
  _id?: string;
  id?: string;
}