'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import { Input } from '@soybelumont/ui/components/input';
import { Label } from '@soybelumont/ui/components/label';
import { Textarea } from '@soybelumont/ui/components/textarea';
import { CartItem, OrderFormData } from '../types/patisserie.types';

interface OrderFormProps {
  items: CartItem[];
  onSubmit: (form: OrderFormData) => void;
  submitting: boolean;
  hideSubmitButton?: boolean;
}

function getMinPickupDate(items: CartItem[]): string {
  const maxDias = items.reduce((max, item) => {
    const dias = item.metadata?.dias_anticipacion ?? 0;
    return Math.max(max, dias);
  }, 0);

  const date = new Date();
  date.setDate(date.getDate() + Math.max(maxDias, 1));
  return date.toISOString().split('T')[0] ?? '';
}

export function OrderForm({
  items,
  onSubmit,
  submitting,
  hideSubmitButton,
}: OrderFormProps) {
  const [form, setForm] = useState<OrderFormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha_retiro: '',
    metodo_pago: 'transferencia',
    notas: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof OrderFormData, string>>
  >({});

  const minDate = getMinPickupDate(items);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    if (!form.nombre.trim()) newErrors.nombre = 'Campo obligatorio';
    if (!form.apellido.trim()) newErrors.apellido = 'Campo obligatorio';
    if (!form.telefono.trim()) newErrors.telefono = 'Campo obligatorio';
    if (!form.fecha_retiro) newErrors.fecha_retiro = 'Seleccioná una fecha';
    else if (form.fecha_retiro < minDate) {
      newErrors.fecha_retiro = `La fecha mínima es ${minDate}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const set =
    (field: keyof OrderFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-semibold text-stone-700">Tus datos</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="nombre" className="text-xs">
            Nombre *
          </Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={set('nombre')}
            placeholder="María"
            className="h-9 text-sm"
          />
          {errors.nombre && (
            <p className="text-xs text-red-500">{errors.nombre}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="apellido" className="text-xs">
            Apellido *
          </Label>
          <Input
            id="apellido"
            value={form.apellido}
            onChange={set('apellido')}
            placeholder="González"
            className="h-9 text-sm"
          />
          {errors.apellido && (
            <p className="text-xs text-red-500">{errors.apellido}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="telefono" className="text-xs">
          Teléfono *
        </Label>
        <Input
          id="telefono"
          type="tel"
          value={form.telefono}
          onChange={set('telefono')}
          placeholder="+54 9 11 1234-5678"
          className="h-9 text-sm"
        />
        {errors.telefono && (
          <p className="text-xs text-red-500">{errors.telefono}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="fecha_retiro" className="text-xs">
          Fecha de retiro *
          {items.some((i) => i.metadata?.dias_anticipacion) && (
            <span className="ml-1 text-amber-600">
              (mín.{' '}
              {Math.max(
                ...items.map((i) => i.metadata?.dias_anticipacion ?? 0)
              )}{' '}
              días)
            </span>
          )}
        </Label>
        <Input
          id="fecha_retiro"
          type="date"
          value={form.fecha_retiro}
          min={minDate}
          onChange={set('fecha_retiro')}
          className="h-9 text-sm"
        />
        {errors.fecha_retiro && (
          <p className="text-xs text-red-500">{errors.fecha_retiro}</p>
        )}
      </div>

      {/* Payment method toggle */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-stone-700">Método de pago</p>
        <div className="flex gap-2">
          {(
            [
              { value: 'transferencia', label: '💳 Transferencia' },
              { value: 'efectivo', label: '💵 Efectivo' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, metodo_pago: opt.value }))
              }
              className={[
                'flex-1 py-2 px-3 rounded-full text-sm font-medium border transition-all duration-150',
                form.metodo_pago === opt.value
                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="notas" className="text-xs">
          Notas (opcional)
        </Label>
        <Textarea
          id="notas"
          value={form.notas}
          onChange={set('notas')}
          placeholder="Ej: sin relleno de dulce de leche, para cumpleaños..."
          rows={2}
          className="text-sm resize-none"
        />
      </div>

      {!hideSubmitButton && (
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Hacer pedido por WhatsApp
        </Button>
      )}
    </form>
  );
}
