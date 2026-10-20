"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 20,
  onRemove,
}: {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  onRemove?: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-100 p-1">
      <button
        type="button"
        className="btn btn-ghost btn-circle btn-xs"
        aria-label="Decrease quantity"
        onClick={() => {
          if (quantity <= min && onRemove) {
            onRemove();
            return;
          }
          onChange(Math.max(min, quantity - 1));
        }}
      >
        {quantity <= min && onRemove ? (
          <Trash2 className="size-3.5" />
        ) : (
          <Minus className="size-3.5" />
        )}
      </button>
      <span className="min-w-8 text-center text-sm font-bold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        className="btn btn-ghost btn-circle btn-xs"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, quantity + 1))}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
