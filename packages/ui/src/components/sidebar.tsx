'use client';

import Link from 'next/link';
import { Package2 } from 'lucide-react';
import { ReactNode } from 'react';

export type SidebarItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Belu Mont</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
