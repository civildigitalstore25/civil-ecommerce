export interface Product {
  _id?: string;
  name: string;
  version: string;
  company: string;
  category: string;
  price1: number;
  price2?: number;
  price3?: number;
  image: string;
  rating?: number;
  description: string;
  reviews?: number;
  viewCount?: number;
}

export interface Category {
  id: number;
  name: string;
  products: number;
  icon: string;
}

export interface Company {
  id: number;
  name: string;
  products: number;
}

export interface Order {
  id: number;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}
