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
  metadata: PatisserieMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  pathname: string;
  thumbnail_url?: string | null;
  metadata?: PatisserieMetadata | null;
}

export interface OrderFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_retiro: string;
  metodo_pago: 'transferencia' | 'efectivo';
  notas?: string;
}
