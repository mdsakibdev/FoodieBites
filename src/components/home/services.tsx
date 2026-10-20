import {
  Bike,
  CalendarCheck,
  ChefHat,
  Headset,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const services = [
  {
    icon: Bike,
    title: "Online Order",
    text: "Order in a couple of taps and track your food from the kitchen to your door.",
  },
  {
    icon: CalendarCheck,
    title: "Pre-Reservation",
    text: "Book your favourite table ahead of time and skip the queue on busy nights.",
  },
  {
    icon: Headset,
    title: "24/7 Service",
    text: "Our team is around at any hour to help with orders, changes and questions.",
  },
  {
    icon: UtensilsCrossed,
    title: "Organized Food Place",
    text: "A calm, welcoming dining room designed for family meals and quick lunches.",
  },
  {
    icon: Sparkles,
    title: "Clean Kitchen",
    text: "Spotless prep areas and strict hygiene checks before every single service.",
  },
  {
    icon: ChefHat,
    title: "Super Chefs",
    text: "Award-winning chefs who cook with seasonal produce and a lot of care.",
  },
];

export function Services() {
  return (
    <section id="services" className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Why FoodieBites"
        title="We Are More Than Multiple Service"
        description="From the first click to the last bite, every part of the experience is built around good food and good hospitality."
        align="center"
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ icon: Icon, title, text }, index) => (
          <Reveal key={title} delay={index * 0.05}>
            <article className="group h-full rounded-box border border-base-300 bg-base-100 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/50">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                {text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
