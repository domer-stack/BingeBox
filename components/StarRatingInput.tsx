"use client";

interface StarRatingInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(value === v ? null : v)}
          className={`star-rating-chip rounded px-2 py-1 text-sm tabular-nums transition ${
            value === v
              ? "bg-[var(--chip-active-bg)] text-[var(--color-accent-soft)] ring-1 ring-[var(--chip-active-border)]"
              : "bg-[var(--chip-bg)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          {v}★
        </button>
      ))}
    </div>
  );
}
