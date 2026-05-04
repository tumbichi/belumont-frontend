import { ReactNode } from 'react';
import { CartProvider } from '../../modules/patisserie/context/CartProvider';

interface PatisserieLayoutProps {
  children: ReactNode;
}

export default function PatisserieLayout({ children }: PatisserieLayoutProps) {
  return <CartProvider>{children}</CartProvider>;
}
