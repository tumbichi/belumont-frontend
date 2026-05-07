'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { PeriodPreset } from '../types';

interface UsePeriodSelectorReturn {
  activePeriod: PeriodPreset;
  customFrom: string | undefined;
  customTo: string | undefined;
  setPreset: (preset: Exclude<PeriodPreset, 'custom'>) => void;
  setCustomRange: (from: string, to: string) => void;
  isPending: boolean;
}

export function usePeriodSelector(): UsePeriodSelectorReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const from = searchParams.get('from') ?? undefined;
  const to = searchParams.get('to') ?? undefined;
  const periodParam = searchParams.get('period');

  let activePeriod: PeriodPreset = 'this_month';
  if (from && to) {
    activePeriod = 'custom';
  } else if (
    periodParam &&
    [
      'today',
      'this_week',
      'this_month',
      'last_7_days',
      'last_30_days',
      'all_time',
      'custom',
    ].includes(periodParam)
  ) {
    activePeriod = periodParam as PeriodPreset;
  }

  const setPreset = (preset: Exclude<PeriodPreset, 'custom'>) => {
    startTransition(() => {
      router.push(`/?period=${preset}`);
    });
  };

  const setCustomRange = (customFrom: string, customTo: string) => {
    startTransition(() => {
      router.push(`/?period=custom&from=${customFrom}&to=${customTo}`);
    });
  };

  return {
    activePeriod,
    customFrom: activePeriod === 'custom' ? from : undefined,
    customTo: activePeriod === 'custom' ? to : undefined,
    setPreset,
    setCustomRange,
    isPending,
  };
}
