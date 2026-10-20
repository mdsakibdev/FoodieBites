import { Sparkles } from "lucide-react";
import { MARQUEE_ITEMS } from "@/data/site";

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      aria-label="Current offers"
      className="border-y border-base-300 bg-primary/10 py-3"
    >
      <div className="flex overflow-hidden">
        <div className="flex w-max shrink-0 animate-marquee items-center">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap px-6 text-sm font-semibold text-ink"
            >
              <Sparkles className="size-4 text-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
