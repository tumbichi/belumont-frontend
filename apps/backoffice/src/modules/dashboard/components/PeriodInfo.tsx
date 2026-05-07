import { ResolvedDateRange } from '../types';
import { formatDateRangeShort } from '../utils/period.utils';

interface PeriodInfoProps {
  dateRange: ResolvedDateRange;
  previousDateRange: ResolvedDateRange;
}

/**
 * Subtle one-liner that answers "what am I looking at?" below the PeriodSelector.
 *
 * Examples:
 *   Mostrando: 1 may – 31 may 2026  ·  Comparando con: 1 abr – 30 abr 2026
 *   Mostrando: todos los tiempos
 */
export function PeriodInfo({ dateRange, previousDateRange }: PeriodInfoProps) {
  const isAllTime = dateRange.label === 'todos los tiempos';

  return (
    <p className="text-xs text-muted-foreground">
      <span>
        Mostrando:{' '}
        <span className="font-medium">
          {isAllTime ? 'todos los tiempos' : formatDateRangeShort(dateRange)}
        </span>
      </span>

      {!isAllTime && (
        <>
          <span className="mx-2 opacity-50">·</span>
          <span>
            Comparando con:{' '}
            <span className="font-medium">
              {formatDateRangeShort(previousDateRange)}
            </span>
          </span>
        </>
      )}
    </p>
  );
}
