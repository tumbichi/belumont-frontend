'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@soybelumont/ui/lib/utils';
import type { SidebarItem } from '@soybelumont/ui/components/sidebar';

interface MobileNavProps {
  items: SidebarItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
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
    </>
  );
}
