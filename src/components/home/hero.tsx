import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock, Search, Star } from "lucide-react";
import { CATEGORIES } from "@/data/products";

const stats = [
  { icon: Star, label: "4.9 rating", value: "12k+ reviews" },
  { icon: Clock, label: "30 min", value: "average delivery" },
  { icon: BadgeCheck, label: "100%", value: "fresh ingredients" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <span className="badge badge-primary badge-outline rounded-full px-3 py-3 text-xs font-bold uppercase tracking-wide">
            Hot &amp; fresh, every day
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            We Serve The Taste
            <br />
            You Love
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-base-content/70">
            This is a type of restaurant which typically serves food and drinks,
            in addition to light refreshments such as baked goods or snacks.
          </p>

          <form
            action="/menu"
            className="mt-8 flex w-full max-w-lg items-center gap-2 rounded-full border border-base-300 bg-base-100 p-2 shadow-soft"
          >
            <Search className="ml-3 size-5 shrink-0 text-base-content/50" />
            <label className="sr-only" htmlFor="hero-search">
              Search dishes
            </label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Search for dishes, drinks and more"
              className="input input-ghost w-full border-0 bg-transparent px-0 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="btn btn-primary shrink-0 rounded-full px-6 font-semibold"
            >
              Explore Food
            </button>
          </form>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <dt className="text-sm font-extrabold text-ink">{label}</dt>
                  <dd className="text-xs text-base-content/60">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute inset-6 -z-0 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-base-100 shadow-soft">
            <Image
              src="/images/hero-plate.jpg"
              alt="A colourful bowl of fresh food"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 520px"
              className="object-cover"
            />
          </div>

          <ul className="absolute -right-2 top-6 hidden gap-2 sm:flex sm:flex-col">
            {CATEGORIES.map((category, index) => (
              <li key={category.id}>
                <Link
                  href={`/menu?category=${category.id}`}
                  className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-xs font-semibold text-ink shadow-soft transition hover:-translate-x-1 hover:border-primary"
                  style={{ marginRight: index * 6 }}
                >
                  <span className="size-2 rounded-full bg-primary" />
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
