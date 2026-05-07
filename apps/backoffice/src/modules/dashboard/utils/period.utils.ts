import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/es';

import { PeriodFilter } from '../schemas/periodFilter.schema';
import { ResolvedDateRange } from '../types';

dayjs.extend(isoWeek);
dayjs.locale('es');

/**
 * Converts a preset or custom range to the actual DateRange.
 * Week starts on MONDAY using dayjs isoWeek plugin (PQ-02 resolved).
 */
export function presetToDateRange(
  period: PeriodFilter,
  now = dayjs()
): ResolvedDateRange {
  if (period.period === 'custom') {
    // TypeScript narrows to the custom branch — from/to are required strings
    const from = (period as { period: 'custom'; from: string; to: string })
      .from;
    const to = (period as { period: 'custom'; from: string; to: string }).to;
    return {
      from,
      to,
      label: 'personalizado',
    };
  }

  switch (period.period) {
    case 'today':
      return {
        from: now.format('YYYY-MM-DD'),
        to: now.format('YYYY-MM-DD'),
        label: 'hoy',
      };
    case 'this_week':
      return {
        from: now.isoWeekday(1).format('YYYY-MM-DD'),
        to: now.isoWeekday(7).format('YYYY-MM-DD'),
        label: 'esta semana',
      };
    case 'this_month':
      return {
        from: now.startOf('month').format('YYYY-MM-DD'),
        to: now.endOf('month').format('YYYY-MM-DD'),
        label: 'este mes',
      };
    case 'last_7_days':
      return {
        from: now.subtract(6, 'day').format('YYYY-MM-DD'),
        to: now.format('YYYY-MM-DD'),
        label: 'últimos 7 días',
      };
    case 'last_30_days':
      return {
        from: now.subtract(29, 'day').format('YYYY-MM-DD'),
        to: now.format('YYYY-MM-DD'),
        label: 'últimos 30 días',
      };
    case 'all_time':
      return {
        from: '2024-01-01',
        to: now.format('YYYY-MM-DD'),
        label: 'todos los tiempos',
      };
    default: {
      // default: this_month
      return {
        from: now.startOf('month').format('YYYY-MM-DD'),
        to: now.endOf('month').format('YYYY-MM-DD'),
        label: 'este mes',
      };
    }
  }
}

/**
 * Calculates percentage change: ((current - previous) / previous) * 100
 * Returns null if previous === 0 to avoid division by zero.
 */
export function getPreviousPeriod(
  current: ResolvedDateRange & { _preset?: PeriodFilter['period'] }
): ResolvedDateRange {
  const fromDay = dayjs(current.from);
  const toDay = dayjs(current.to);
  const durationDays = toDay.diff(fromDay, 'day') + 1;

  // Use label to detect preset type
  if (current.label === 'todos los tiempos') {
    // No meaningful previous period for all-time — return the same range
    return { ...current };
  }

  if (current.label === 'hoy') {
    const yesterday = fromDay.subtract(1, 'day');
    return {
      from: yesterday.format('YYYY-MM-DD'),
      to: yesterday.format('YYYY-MM-DD'),
      label: 'ayer',
    };
  }

  if (current.label === 'esta semana') {
    const prevMonday = fromDay.subtract(1, 'week').isoWeekday(1);
    const prevSunday = prevMonday.isoWeekday(7);
    return {
      from: prevMonday.format('YYYY-MM-DD'),
      to: prevSunday.format('YYYY-MM-DD'),
      label: 'semana anterior',
    };
  }

  if (current.label === 'este mes') {
    const prevMonth = fromDay.subtract(1, 'month');
    return {
      from: prevMonth.startOf('month').format('YYYY-MM-DD'),
      to: prevMonth.endOf('month').format('YYYY-MM-DD'),
      label: 'mes anterior',
    };
  }

  // last_7_days, last_30_days, custom — same duration before range start
  const prevTo = fromDay.subtract(1, 'day');
  const prevFrom = prevTo.subtract(durationDays - 1, 'day');
  return {
    from: prevFrom.format('YYYY-MM-DD'),
    to: prevTo.format('YYYY-MM-DD'),
    label: 'período anterior',
  };
}

/**
 * Formats a YYYY-MM-DD date string as a short Spanish label.
 * Same year as today → "6 may"
 * Different year → "6 may 2025"
 */
export function formatDateShort(dateStr: string): string {
  const d = dayjs(dateStr);
  const currentYear = dayjs().year();
  return d.year() === currentYear
    ? d.locale('es').format('D MMM') // "1 may"
    : d.locale('es').format('D MMM YYYY'); // "1 may 2025"
}

/**
 * Formats a date range as "1 may – 31 may" or "1 may 2024 – 31 may 2025"
 */
export function formatDateRangeShort(range: ResolvedDateRange): string {
  return `${formatDateShort(range.from)} – ${formatDateShort(range.to)}`;
}
export function calculatePercentageChange(
  current: number,
  previous: number
): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
