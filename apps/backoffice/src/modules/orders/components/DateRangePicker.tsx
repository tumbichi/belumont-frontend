'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@soybelumont/ui/lib/utils';

// Inline the DateRange shape from react-day-picker (lives in packages/ui, not a direct dep here)
type DateRange = { from: Date | undefined; to?: Date | undefined };
import { Button } from '@soybelumont/ui/components/button';
import { Calendar } from '@soybelumont/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@soybelumont/ui/components/popover';

// ─── Helpers ───────────────────────────────────────────────────────────────

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

// ─── Props ─────────────────────────────────────────────────────────────────

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
  placeholder?: string;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

/**
 * Date range picker with a 3-phase selection cycle:
 *   idle      → first click sets "from", moves to selecting
 *   selecting → next click sets "to" (must be ≥ from), closes popover
 *   (if both set and user reopens) → next click RESETS, starts new "from"
 */
export function DateRangePicker({
  from,
  to,
  onChange,
  placeholder = 'Seleccionar fechas',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  /**
   * 'idle'      → waiting for the user to click a "from" date
   * 'selecting' → "from" is pinned, waiting for "to"
   */
  const [phase, setPhase] = React.useState<'idle' | 'selecting'>('idle');

  // Bug 4: track hovered day to render range preview while selecting
  const [hoveredDay, setHoveredDay] = React.useState<Date | undefined>(
    undefined
  );

  // Today at end-of-day — used as max date ceiling
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  // Sync phase from external props whenever the popover opens.
  // Clear hovered day whenever popover closes.
  React.useEffect(() => {
    if (open) {
      setPhase(from && !to ? 'selecting' : 'idle');
    } else {
      setHoveredDay(undefined);
    }
  }, [open]); // intentionally only on `open` change — not from/to

  // ── Selection handler ────────────────────────────────────────────────────

  function handleSelect(range: DateRange | undefined, clickedDay: Date) {
    if (phase === 'idle') {
      // Any click in idle phase starts a fresh range regardless of what
      // DayPicker computed — this is the reset behaviour.
      onChange({ from: clickedDay, to: undefined });
      setPhase('selecting');
    } else {
      // phase === 'selecting': we have `from`, user is picking `to`
      const newFrom = range?.from ?? from;
      const newTo = range?.to;

      if (newFrom && newTo) {
        // Range complete — emit and close
        onChange({ from: newFrom, to: newTo });
        setPhase('idle');
        setHoveredDay(undefined);
        setOpen(false);
      } else {
        // DayPicker reset internally (clicked before from) → new from selected
        onChange({ from: newFrom, to: undefined });
        setPhase('selecting');
      }
    }
  }

  // ── What the calendar displays as selected ───────────────────────────────

  // In 'idle' phase: show the full existing range (if any) so user sees
  // their previous selection before they start a new one.
  // In 'selecting' phase: show only `from` so the range highlight is partial.
  const calendarSelected: DateRange | undefined = from
    ? { from, to: phase === 'idle' ? to : undefined }
    : undefined;

  // ── Disabled dates ───────────────────────────────────────────────────────

  function isDisabled(day: Date): boolean {
    // Never allow future dates
    if (day > today) return true;
    // When picking "to", disallow dates before "from"
    if (phase === 'selecting' && from && day < from) return true;
    return false;
  }

  // ── Hover preview modifiers (Bug 4) ─────────────────────────────────────

  // range_preview: the "body" of the hover range — days strictly between
  // `from` and `hoveredDay` (exclusive on both ends).
  const rangePreviewModifier = React.useCallback(
    (day: Date): boolean => {
      if (phase !== 'selecting' || !from || !hoveredDay) return false;
      if (hoveredDay <= from) return false;
      return day > from && day < hoveredDay;
    },
    [phase, from, hoveredDay]
  );

  // range_to_preview: only the hovered endpoint day itself, so we can give
  // it a distinct style (rounded pill, like a real range_end).
  const rangeToPreviewModifier = React.useCallback(
    (day: Date): boolean => {
      if (phase !== 'selecting' || !from || !hoveredDay) return false;
      if (hoveredDay <= from) return false;
      return day.toDateString() === hoveredDay.toDateString();
    },
    [phase, from, hoveredDay]
  );

  // ── Trigger label ────────────────────────────────────────────────────────

  const triggerLabel = React.useMemo(() => {
    if (from && to) return formatRange(from, to);
    if (from) return `Desde ${formatShort(from)} →`;
    return null;
  }, [from, to]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs text-muted-foreground">Fecha</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-9 justify-start text-left text-sm font-normal w-full sm:min-w-[220px] sm:w-auto',
              !triggerLabel && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{triggerLabel ?? placeholder}</span>
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
            defaultMonth={from ?? today}
            // Bug 4: range preview while hovering during 'selecting' phase
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
