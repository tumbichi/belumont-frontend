'use client';

import { Badge } from '@soybelumont/ui/components/badge';
import { useTranslations } from 'next-intl';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  delivered: 'default',
  sent: 'secondary',
  bounced: 'destructive',
  complained: 'destructive',
  opened: 'default',
  clicked: 'default',
};

const STATUS_CLASSES: Record<string, string> = {
  delivered: 'bg-green-100 text-green-800 hover:bg-green-100',
  sent: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  bounced: 'bg-red-100 text-red-800 hover:bg-red-100',
  complained: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  opened: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  clicked: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
};

const STATUS_KEY: Record<string, string> = {
  delivered: 'STATUS_DELIVERED',
  sent: 'STATUS_SENT',
  bounced: 'STATUS_BOUNCED',
  complained: 'STATUS_COMPLAINED',
  opened: 'STATUS_OPENED',
  clicked: 'STATUS_CLICKED',
};

interface EmailStatusBadgeProps {
  status: string;
}

export function EmailStatusBadge({ status }: EmailStatusBadgeProps) {
  const t = useTranslations('EMAILS');
  const key = STATUS_KEY[status];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const label = key ? t(key as any) : status;
  const variant = STATUS_VARIANT[status] ?? 'outline';
  const className = STATUS_CLASSES[status] ?? '';

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
