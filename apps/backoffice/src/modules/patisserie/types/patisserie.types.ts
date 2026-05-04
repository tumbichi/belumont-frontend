export interface PatisserieMetadata {
  porciones?: string;
  alergenos?: string;
  dias_anticipacion?: number;
}

export interface PatisserieProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  pathname: string;
  image_url: string | null;
  thumbnail_url: string | null;
  active: boolean;
  category: string | null;
  stock_status: 'available' | 'out_of_stock' | 'on_request';
  metadata: PatisserieMetadata | Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type CreatePatisserieInput = Omit<
  PatisserieProduct,
  'id' | 'created_at' | 'updated_at'
>;
export type UpdatePatisserieInput = Partial<CreatePatisserieInput>;
