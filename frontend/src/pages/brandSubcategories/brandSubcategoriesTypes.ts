export interface SubCategory {
  name: string;
  category: string;
  displayName: string;
}

export interface BrandData {
  name: string;
  displayName: string;
  description: string;
  subcategories: SubCategory[];
}
