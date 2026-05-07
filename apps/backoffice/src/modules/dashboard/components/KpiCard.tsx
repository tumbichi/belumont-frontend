import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import { ComparisonBadge } from './ComparisonBadge';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
  comparison?: {
    percentage: number | null;
    label: string;
  };
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  accent = false,
  comparison,
}: KpiCardProps) {
  return (
    <Card className={accent ? 'border-primary/30 bg-primary/5' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon
          className={`h-4 w-4 ${accent ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {comparison && (
          <div className="mt-1">
            <ComparisonBadge
              percentage={comparison.percentage}
              label={comparison.label}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
