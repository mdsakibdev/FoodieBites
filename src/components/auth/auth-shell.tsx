import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BowlMark } from "@/components/brand/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
      <div className="order-2 mx-auto w-full max-w-md lg:order-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 transition hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-base-content/70">
          {subtitle}
        </p>
        <div className="mt-7">{children}</div>
        <div className="mt-6 text-sm text-base-content/70">{footer}</div>
      </div>

      <div className="relative order-1 hidden aspect-[4/5] overflow-hidden rounded-[2rem] border-8 border-base-100 shadow-soft lg:order-2 lg:block">
        <Image
          src="/images/hero-plate.jpg"
          alt="A fresh bowl of food"
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 520px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-neutral-content">
          <BowlMark className="size-8 text-primary" />
          <p className="mt-3 text-2xl font-extrabold">
            Good food, one tap away.
          </p>
          <p className="mt-2 text-sm text-neutral-content/70">
            Save your favourites, reorder in seconds and track every delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
