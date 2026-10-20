import { Star } from "lucide-react";

export function Stars({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          width={size}
          height={size}
          className={
            index < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-base-300 text-base-300"
          }
        />
      ))}
    </span>
  );
}
