interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function StarRating({ rating, max = 5, size = "md", showValue = false }: StarRatingProps) {
  const sizeClass = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];

  const stars = Array.from({ length: max }, (_, i) => {
    const starValue = i + 1;
    const filled = rating >= starValue;
    const half = !filled && rating >= starValue - 0.5;
    return (
      <span
        key={i}
        className={filled || half ? "star-filled" : "star-empty"}
        aria-hidden
      >
        ★
      </span>
    );
  });

  return (
    <span
      className={`inline-flex items-center gap-0.5 tracking-tighter ${sizeClass}`}
      aria-label={`${rating} out of ${max} stars`}
    >
      {stars}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium tabular-nums text-[var(--color-muted)]">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
