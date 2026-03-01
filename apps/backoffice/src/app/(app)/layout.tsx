import { getMessages } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Button } from '@soybelumont/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@soybelumont/ui/components/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@soybelumont/ui/components/sheet';
import Sidebar, { SidebarItem } from '@soybelumont/ui/components/sidebar';
import {
  Home,
  LineChart,
  Menu,
  Package,
  ShoppingCart,
  Users,
  User,
} from 'lucide-react';
import Link from 'next/link';

import { cookies } from 'next/headers';
import { verifyJWT } from '@core/lib/auth';
import { MobileNav } from '@core/components/mobile-nav';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token || !verifyJWT(token)) {
    redirect('/login');
  }

  const messages = await getMessages();

  const t = (namespace: string, key: string, fallback: string) => {
    const ns = messages[namespace];
    if (typeof ns === 'object' && ns !== null && key in ns) {
      return ns[key as keyof typeof ns] as string;
    }
    return fallback;
  };

  const handleLogout = async () => {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    redirect('/login');
  };

  const sidebarItems: SidebarItem[] = [
    {
      title: t('SIDEBAR', 'DASHBOARD', 'Dashboard'),
      href: '/',
      icon: <Home className="w-4 h-4" />,
    },
    {
      title: t('SIDEBAR', 'ORDERS', 'Órdenes'),
      href: '/ordenes',
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      title: t('SIDEBAR', 'PRODUCTS', 'Productos'),
      href: '/productos',
      icon: <Package className="w-4 h-4" />,
    },
    {
      title: t('SIDEBAR', 'USERS', 'Usuarios'),
      href: '/usuarios',
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: t('SIDEBAR', 'PROMOS', 'Promociones'),
      href: '/promociones',
      icon: <LineChart className="w-4 h-4" />,
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar items={sidebarItems} brandName="Belu Mont" />
      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">
                  {t('COMMON', 'TOGGLE_NAV', 'Abrir menú de navegación')}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetTitle className="sr-only">Navegación</SheetTitle>
              <SheetDescription className="sr-only">Menú de navegación principal</SheetDescription>
              <nav className="grid gap-1 pt-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-lg font-semibold text-foreground mb-4"
                >
                  Belu Mont
                </Link>
                <MobileNav items={sidebarItems} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1 w-full" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  <User className="h-4 w-4" />
                </div>
                <span className="sr-only">
                  {t('COMMON', 'TOGGLE_USER_MENU', 'Abrir menú de usuario')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {t('COMMON', 'MY_ACCOUNT', 'Mi Cuenta')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('COMMON', 'SETTINGS', 'Configuración')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('COMMON', 'SUPPORT', 'Soporte')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={handleLogout}>
                <button type="submit" className="w-full text-left">
                  <DropdownMenuItem>
                    {t('COMMON', 'LOGOUT', 'Cerrar sesión')}
                  </DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-auto p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
