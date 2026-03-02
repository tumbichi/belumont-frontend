export interface ProductDeliveryProps {
  productName: string;
  username: string;
  downloadLink: string;
}

export interface DownloadItem {
  name: string;
  downloadUrl: string;
}

export interface PackDeliveryProps {
  packName: string;
  username: string;
  items: DownloadItem[];
}

export interface ProductUpdateDeliveryProps {
  productName: string;
  username: string;
  downloadLink: string;
}

export type EmailTemplateName =
  | 'product-delivery'
  | 'pack-delivery'
  | 'product-update-delivery';

export interface EmailTemplateInfo {
  id: EmailTemplateName;
  name: string;
  description: string;
  emoji: string;
}

export const EMAIL_TEMPLATES: EmailTemplateInfo[] = [
  {
    id: 'product-delivery',
    name: 'Entrega de Producto',
    description:
      'Email de entrega de producto individual después de la compra.',
    emoji: '🧑🏽‍🍳',
  },
  {
    id: 'pack-delivery',
    name: 'Entrega de Pack',
    description: 'Email de entrega de pack/bundle después de la compra.',
    emoji: '📦',
  },
  {
    id: 'product-update-delivery',
    name: 'Actualización de Producto',
    description:
      'Notificación a compradores existentes de una nueva versión del producto.',
    emoji: '🔄',
  },
];
