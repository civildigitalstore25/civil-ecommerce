export interface Banner {
  _id?: string;
  title: string;
  description: string;
  ctaButtonText: string;
  ctaButtonLink?: string; // optional
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  startDate: string;
  endDate: string;
  position: string;
  bannerType: string;
  priority: number;
  status: string;
  backgroundColor?: string; // optional
  textColor?: string; // optional
}
