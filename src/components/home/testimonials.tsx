import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { REVIEWS } from "@/data/site";
import { formatRating } from "@/lib/format";

export function Testimonials() {
  const average =
    REVIEWS.reduce((total, review) => total + review.rating, 0) /
    REVIEWS.length;

  return (
    <section id="reviews" className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Testimonials"
        title="What Our Guests Say"
        description={`Rated ${formatRating(average)} out of 5 by diners and delivery customers across the city.`}
        align="center"
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {REVIEWS.map((review, index) => (
          <Reveal key={review.name} delay={index * 0.06}>
            <figure className="flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-6 shadow-soft">
              <Quote className="size-8 text-primary/40" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-base-content/75">
                “{review.quote}”
              </blockquote>
              <Stars rating={review.rating} className="mt-4" />
              <figcaption className="mt-4 flex items-center gap-3 border-t border-base-300 pt-4">
                <Image
                  src={review.avatar}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-ink">{review.name}</p>
                  <p className="text-xs text-base-content/60">{review.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
