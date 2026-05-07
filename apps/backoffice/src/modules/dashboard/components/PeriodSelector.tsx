'use client';

import * as React from 'react';
import dayjs from 'dayjs';
import { CalendarDays } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import { Calendar } from '@soybelumont/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@soybelumont/ui/components/popover';
import { cn } from '@soybelumont/ui/lib/utils';
import { usePeriodSelector } from '../hooks/usePeriodSelector';
import { PeriodPreset } from '../types';
import { formatDateShort } from '../utils/period.utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type DateRange = { from: Date | undefined; to?: Date | undefined };

interface PeriodSelectorProps {
  activePeriod: PeriodPreset;
  customFrom?: string;
  customTo?: string;
}

// ─── Preset config ───────────────────────────────────────────────────────────

const PRESETS: { value: Exclude<PeriodPreset, 'custom'>; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: 'this_week', label: 'Esta semana' },
  { value: 'this_month', label: 'Este mes' },
  { value: 'last_7_days', label: 'Últimos 7 días' },
  { value: 'last_30_days', label: 'Últimos 30 días' },
  { value: 'all_time', label: 'Todos los tiempos' },
];

// ─── Date formatting helpers ─────────────────────────────────────────────────

function formatShort(date: Date): string {
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

function formatRange(from: Date, to: Date): string {
  const sameYear = from.getFullYear() === to.getFullYear();
  const fromStr = from.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const toStr = to.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${fromStr} – ${toStr}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Period selector toolbar — all presets + custom date range picker
 * in a single cohesive horizontal row.
 *
 * Design intent:
 * - Warm, operational feel (backoffice for a patisserie)
 * - All buttons at the same visual height (h-9)
 * - Active = default/filled; inactive = ghost/outline
 * - "Personalizado" trigger is inline with presets — shows date range text
 *   when a custom period is active, calendar icon + label otherwise
 * - Calendar popover copies exact behavior from Orders DateRangePicker
 * - Horizontal scroll on mobile, flex-wrap on desktop
 */
export function PeriodSelector({
  activePeriod: _activePeriod,
  customFrom: _customFrom,
  customTo: _customTo,
}: PeriodSelectorProps) {
  const {
    activePeriod,
    customFrom,
    customTo,
    setPreset,
    setCustomRange,
    isPending,
  } = usePeriodSelector();

  // ── Popover state ──────────────────────────────────────────────────────────
  const [open, setOpen] = React.useState(false);

  /**
   * 'idle'      → waiting for user to pick "from"
   * 'selecting' → "from" pinned, waiting for "to"
   */
  const [phase, setPhase] = React.useState<'idle' | 'selecting'>('idle');

  // Local draft while selecting (not yet committed to URL)
  const [draftFrom, setDraftFrom] = React.useState<Date | undefined>(undefined);

  const [hoveredDay, setHoveredDay] = React.useState<Date | undefined>(
    undefined
  );

  // Resolved dates from URL params (committed custom range).
  // Use dayjs() to parse YYYY-MM-DD as LOCAL midnight — new Date("YYYY-MM-DD")
  // parses as UTC midnight and shifts the date back one day at UTC-3 (Argentina).
  const fromDate = customFrom ? dayjs(customFrom).toDate() : undefined;
  const toDate = customTo ? dayjs(customTo).toDate() : undefined;

  // Today ceiling for disabled check
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  // Sync phase & draft when popover opens/closes
  React.useEffect(() => {
    if (open) {
      setDraftFrom(fromDate);
      setPhase(fromDate && !toDate ? 'selecting' : 'idle');
    } else {
      setHoveredDay(undefined);
      setDraftFrom(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Selection handler ─────────────────────────────────────────────────────

  function handleSelect(range: DateRange | undefined, clickedDay: Date) {
    if (phase === 'idle') {
      // Start a fresh range — pin "from", enter selecting phase
      setDraftFrom(clickedDay);
      setPhase('selecting');
    } else {
      // phase === 'selecting': user is picking "to"
      const newFrom = range?.from ?? draftFrom;
      const newTo = range?.to;

      if (newFrom && newTo) {
        // Range complete — commit to URL and close
        // Use dayjs local-time formatting to avoid UTC offset shifting the date
        // (e.g. toISOString() at midnight ART UTC-3 would return previous day)
        const fmt = (d: Date): string => dayjs(d).format('YYYY-MM-DD');
        setCustomRange(fmt(newFrom), fmt(newTo));
        setPhase('idle');
        setHoveredDay(undefined);
        setOpen(false);
      } else {
        // DayPicker reset (user clicked before "from") → new "from"
        setDraftFrom(newFrom);
        setPhase('selecting');
      }
    }
  }

  // ── Calendar display state ────────────────────────────────────────────────

  // What to show as "selected" in the calendar:
  // idle   → show committed range (so user sees their previous selection)
  // selecting → show only draftFrom so range highlight is partial
  const activeFrom = phase === 'idle' ? fromDate : draftFrom;
  const activeTo = phase === 'idle' ? toDate : undefined;
  const calendarSelected: DateRange | undefined = activeFrom
    ? { from: activeFrom, to: activeTo }
    : undefined;

  // ── Disabled dates ────────────────────────────────────────────────────────

  function isDisabled(day: Date): boolean {
    if (day > today) return true;
    if (phase === 'selecting' && draftFrom && day < draftFrom) return true;
    return false;
  }

  // ── Hover range preview modifiers ─────────────────────────────────────────

  const rangePreviewModifier = React.useCallback(
    (day: Date): boolean => {
      if (phase !== 'selecting' || !draftFrom || !hoveredDay) return false;
      if (hoveredDay <= draftFrom) return false;
      return day > draftFrom && day < hoveredDay;
    },
    [phase, draftFrom, hoveredDay]
  );

  const rangeToPreviewModifier = React.useCallback(
    (day: Date): boolean => {
      if (phase !== 'selecting' || !draftFrom || !hoveredDay) return false;
      if (hoveredDay <= draftFrom) return false;
      return day.toDateString() === hoveredDay.toDateString();
    },
    [phase, draftFrom, hoveredDay]
  );

  // ── Custom trigger label ──────────────────────────────────────────────────

  const customLabel = React.useMemo(() => {
    if (customFrom && customTo)
      return `${formatDateShort(customFrom)} – ${formatDateShort(customTo)}`;
    if (customFrom) return `Desde ${formatDateShort(customFrom)} →`;
    return null;
  }, [customFrom, customTo]);

  const isCustomActive = activePeriod === 'custom';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 overflow-x-auto pb-0.5',
        'flex-nowrap sm:flex-wrap',
        isPending && 'pointer-events-none opacity-60'
      )}
    >
      {/* Preset buttons */}
      {PRESETS.map((preset) => (
        <Button
          key={preset.value}
          size="sm"
          variant={activePeriod === preset.value ? 'default' : 'outline'}
          className="h-9 shrink-0 whitespace-nowrap text-sm"
          onClick={() => setPreset(preset.value)}
          disabled={isPending}
        >
          {preset.label}
        </Button>
      ))}

      {/* Custom date range trigger — inline with presets */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant={isCustomActive ? 'default' : 'outline'}
            className="h-9 shrink-0 whitespace-nowrap text-sm"
            disabled={isPending}
          >
            {isCustomActive && customLabel ? (
              <>
                <CalendarDays className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span>{customLabel}</span>
              </>
            ) : (
              <>
                <CalendarDays className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                Personalizado
              </>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={calendarSelected}
            onSelect={(range, day) =>
              handleSelect(range as DateRange | undefined, day as Date)
            }
            disabled={isDisabled}
            numberOfMonths={1}
            defaultMonth={fromDate ?? today}
            modifiers={{
              range_preview: rangePreviewModifier,
              range_to_preview: rangeToPreviewModifier,
            }}
            modifiersClassNames={{
              range_preview: 'bg-primary/15 !rounded-none',
              range_to_preview:
                'bg-primary/30 text-primary-foreground !rounded-md',
            }}
            onDayMouseEnter={(day: Date) => {
              if (phase === 'selecting') setHoveredDay(day);
            }}
            onDayMouseLeave={() => setHoveredDay(undefined)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
