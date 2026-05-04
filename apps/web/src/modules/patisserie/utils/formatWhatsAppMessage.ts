import { CartItem, OrderFormData } from '../types/patisserie.types';

function formatDate(dateStr: string): string {
  // Parse YYYY-MM-DD without timezone shift
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatMetodoPago(metodo: OrderFormData['metodo_pago']): string {
  return metodo === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo';
}

export function formatWhatsAppMessage(
  items: CartItem[],
  form: OrderFormData,
  total: number
): string {
  const productLines = items
    .map(
      (item) =>
        `- ${item.quantity}x ${item.name} → $${(item.price * item.quantity).toLocaleString('es-AR')}`
    )
    .join('\n');

  const notasLine = form.notas?.trim() ? `\n_Notas: ${form.notas.trim()}_` : '';

  return `*Nuevo pedido — Belu Mont Patisserie*
_(Todos los productos son 100% sin TACC / sin gluten)_

*Datos del pedido*
Nombre: ${form.nombre} ${form.apellido}
Teléfono: ${form.telefono}
Fecha de retiro deseada: ${formatDate(form.fecha_retiro)}
Método de pago: ${formatMetodoPago(form.metodo_pago)}

*Productos*
${productLines}

*Total estimado: $${total.toLocaleString('es-AR')}*${notasLine}

_Pedido desde belumont.com.ar/pasteleria_`;
}
