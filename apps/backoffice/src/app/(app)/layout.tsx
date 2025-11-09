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
  SheetTrigger,
} from '@soybelumont/ui/components/sheet';
import Sidebar, { SidebarItem } from '@soybelumont/ui/components/sidebar';
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import '@soybelumont/ui/globals.css';
import { cookies } from 'next/headers';
import { verifyJWT } from '@core/lib/auth';

export default async function RootLayout({
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

  const handleLogout = async () => {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    redirect('/login');
  };

  const sidebarItems: SidebarItem[] = [
    {
      title:
        typeof messages['SIDEBAR'] === 'object' &&
        'DASHBOARD' in messages['SIDEBAR']
          ? (messages['SIDEBAR']?.DASHBOARD as string)
          : 'DASHBOARD',
      href: '/',
      icon: <Home className="w-4 h-4" />,
    },
    {
      title:
        typeof messages['SIDEBAR'] === 'object' &&
        'ORDERS' in messages['SIDEBAR']
          ? (messages['SIDEBAR']?.ORDERS as string)
          : 'ORDERS',
      href: '/ordenes',
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      title:
        typeof messages['SIDEBAR'] === 'object' &&
        'PRODUCTS' in messages['SIDEBAR']
          ? (messages['SIDEBAR']?.PRODUCTS as string)
          : 'PRODUCTS',
      href: '/productos',
      icon: <Package className="w-4 h-4" />,
    },
    {
      title:
        typeof messages['SIDEBAR'] === 'object' &&
        'USERS' in messages['SIDEBAR']
          ? (messages['SIDEBAR']?.USERS as string)
          : 'USERS',
      href: '/usuarios',
      icon: <Users className="w-4 h-4" />,
    },
    {
      title:
        typeof messages['SIDEBAR'] === 'object' &&
        'PROMOS' in messages['SIDEBAR']
          ? (messages['SIDEBAR']?.PROMOS as string)
          : 'PROMOTIONS',
      href: '/promociones',
      icon: <LineChart className="w-4 h-4" />,
    },
    // {
    //   title:
    //     typeof messages['SIDEBAR'] === 'object' &&
    //     'ANALYTICS' in messages['SIDEBAR']
    //       ? (messages['SIDEBAR']?.ANALYTICS as string)
    //       : 'ANALYTICS',
    //   href: '/analytics',
    //   icon: <LineChart className="w-4 h-4" />,
    // },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar items={sidebarItems} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="w-6 h-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1 w-full">
            {/* Search or other header content */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Image
                  src="/placeholder-user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="rounded-full"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={handleLogout}>
                <button type="submit" className="w-full text-left">
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
