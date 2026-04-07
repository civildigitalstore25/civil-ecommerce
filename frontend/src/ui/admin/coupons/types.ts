export interface Coupon {
  _id?: string;
  code: string;
  name: string;
  description?: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  status: "Active" | "Inactive";
  applicableProductIds?: string[] | { _id: string; name?: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductOption {
  _id: string;
  name: string;
  category?: string;
}

export type CouponFormPayload = {
  code: string;
  name: string;
  description: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  status: "Active" | "Inactive";
  applicableProductIds: string[];
};
