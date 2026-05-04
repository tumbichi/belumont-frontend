import { CreatePatisserie } from '@modules/patisserie/features/CreatePatisserie';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Producto de Pastelería | Belu Mont Backoffice',
  description: 'Crear un nuevo producto de pastelería',
};

export default function CreatePasteleriaPage() {
  return <CreatePatisserie />;
}
