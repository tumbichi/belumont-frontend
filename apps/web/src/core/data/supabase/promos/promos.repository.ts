import getPromoCodeByCode from './services/getPromoCodeByCode';
import incrementPromoCodeUsage from './services/incrementPromoCodeUsage';

export type PromoCode = {
  id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  applies_to_all: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: Date;
  products: { product_id: string }[];
};

export interface PromosRepositoryReturn {
  getByCode: (code: string) => Promise<PromoCode | null>;
  incrementUsage: (id: string) => Promise<void>;
}

export const PromosRepository = (): PromosRepositoryReturn => ({
  getByCode: getPromoCodeByCode,
  incrementUsage: incrementPromoCodeUsage,
});
