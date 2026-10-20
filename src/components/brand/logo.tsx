import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-xl font-extrabold tracking-tight text-ink ${className}`}
      aria-label="FoodieBites home"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content shadow-soft">
        <BowlMark className="size-5" />
      </span>
      <span>
        Foodie<span className="text-primary">Bites</span>
      </span>
    </Link>
  );
}

export function BowlMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 11a8 8 0 0 1 16 0v.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 11.5V11Z"
        fill="currentColor"
      />
      <path d="M3 17h18M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="6" r="1.4" fill="currentColor" opacity=".7" />
    </svg>
  );
}
