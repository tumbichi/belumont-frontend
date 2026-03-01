'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package2 } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type SidebarItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

interface SidebarProps {
  items: SidebarItem[];
  brandName?: string;
}

export default function Sidebar({ items, brandName = 'Belu Mont' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-primary" />
            <span>{brandName}</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-3 text-sm font-medium">
            {items.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
