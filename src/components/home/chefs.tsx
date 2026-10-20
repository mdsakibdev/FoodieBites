import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { CHEFS } from "@/data/site";

export function Chefs() {
  return (
    <section id="chefs" className="bg-ink py-16 text-neutral-content lg:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            The people behind the plates
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Meet Our Super Chefs
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-content/70 sm:text-base">
            Four different kitchens, one shared obsession: making every plate
            taste like it was cooked just for you.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHEFS.map((chef, index) => (
            <Reveal key={chef.name} delay={index * 0.06}>
              <figure className="group overflow-hidden rounded-box border border-neutral-content/10 bg-neutral-content/5">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={chef.image}
                    alt={`${chef.name}, ${chef.role}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                </div>
                <figcaption className="p-4">
                  <p className="text-base font-bold">{chef.name}</p>
                  <p className="text-xs uppercase tracking-wide text-primary">
                    {chef.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
