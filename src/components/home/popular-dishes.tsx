"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/lib/types";

export function PopularDishes({ products }: { products: Product[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    scroller.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  }

  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Loved by our guests"
        title="Popular Dishes"
        description="Six chef favourites, ready to be delivered or reserved for your table."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-circle btn-outline border-base-300"
              aria-label="Previous dishes"
              onClick={() => scroll(-1)}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              className="btn btn-circle btn-outline border-base-300"
              aria-label="More dishes"
              onClick={() => scroll(1)}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        }
      />

      <div
        ref={scroller}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.slug}
            className="w-[270px] shrink-0 snap-start sm:w-[300px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
