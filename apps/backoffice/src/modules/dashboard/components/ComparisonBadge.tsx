interface ComparisonBadgeProps {
  percentage: number | null;
  label: string;
}

export function ComparisonBadge({ percentage, label }: ComparisonBadgeProps) {
  if (percentage === null) return null;

  if (percentage > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
        ↑ {percentage}% {label}
      </span>
    );
  }

  if (percentage < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 rounded px-1.5 py-0.5">
        ↓ {Math.abs(percentage)}% {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted rounded px-1.5 py-0.5">
      → 0% {label}
    </span>
  );
}
