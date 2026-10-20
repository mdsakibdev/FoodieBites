import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, Smartphone, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export function AppDownload() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-secondary px-6 py-12 text-secondary-content sm:px-10 lg:py-16">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/30 blur-2xl" />
        <div className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Order on the go"
              title={
                <span className="text-secondary-content">
                  Get The FoodieBites App
                </span>
              }
              description="Track deliveries in real time, save your favourite orders and get app-only offers every week."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/menu" className="btn btn-neutral rounded-full px-6">
                <Smartphone className="size-4" /> App Store
              </Link>
              <Link href="/menu" className="btn btn-outline rounded-full border-secondary-content/40 px-6 text-secondary-content hover:bg-secondary-content hover:text-secondary">
                Google Play
              </Link>
            </div>
            <p className="mt-4 text-xs text-secondary-content/70">
              Free to download · No subscription · Works on iOS and Android
            </p>
          </div>

          <div className="relative mx-auto w-[250px] sm:w-[270px]">
            <div className="absolute -left-6 top-10 rotate-[-8deg] rounded-2xl border border-base-300 bg-base-100 p-3 text-ink shadow-xl">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-primary/15 text-primary">
                  <Bell className="size-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-base-content/50">
                    Order update
                  </p>
                  <p className="text-xs font-semibold">Your food is on the way</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-[2.5rem] border-8 border-ink bg-base-100 p-2.5 shadow-2xl">
              <div className="rounded-[1.9rem] bg-cream p-3">
                <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-ink/20" />
                <div className="rounded-2xl bg-primary p-3 text-primary-content">
                  <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                    Today&apos;s pick
                  </p>
                  <p className="text-sm font-extrabold">Truffle French Fries</p>
                  <p className="text-xs opacity-90">$6.50 · 10 min</p>
                </div>
                <div className="relative mt-3 h-28 overflow-hidden rounded-xl">
                  <Image
                    src="/images/hero-plate.jpg"
                    alt="Food in the FoodieBites app"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    ["Spaghetti Carbonara", "4.9"],
                    ["Beef Tacos", "4.8"],
                  ].map(([name, rating]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-xl bg-base-100 px-3 py-2"
                    >
                      <span className="text-[11px] font-semibold text-ink">
                        {name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {rating}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-ink px-3 py-2 text-neutral-content">
                  <span className="text-[11px] font-semibold">View cart</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
