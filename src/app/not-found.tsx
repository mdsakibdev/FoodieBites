import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
        <UtensilsCrossed className="size-8" />
      </span>
      <p className="mt-6 text-6xl font-extrabold tracking-tight text-primary">
        404
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
        This dish is off the menu
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-base-content/70">
        The page you were looking for has been eaten, moved or never existed.
        Let&apos;s get you back to something delicious.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary rounded-full px-6">
          Back home
        </Link>
        <Link href="/menu" className="btn btn-ghost rounded-full">
          Browse the menu
        </Link>
      </div>
    </div>
  );
}
