import { Wheat, MapPin, MessageCircle } from 'lucide-react';

export function PatisserieDisclaimer() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-start sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <Wheat className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">
              100% Sin TACC
            </p>
            <p className="text-xs text-amber-700">
              Todos los productos son sin gluten
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-amber-200" />

        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Retiro en Baradero
            </p>
            <p className="text-xs text-amber-700">
              Solo retiro presencial, sin envíos
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-amber-200" />

        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Pedidos por WhatsApp
            </p>
            <p className="text-xs text-amber-700">
              Coordinamos fecha y detalles juntos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
