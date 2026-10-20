"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { CATEGORIES } from "@/data/products";
import type { CategoryId, Product } from "@/lib/types";

const tabs: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...CATEGORIES,
];

export function MenuPack({ products }: { products: Product[] }) {
  const [active, setActive] = useState<CategoryId | "all">("all");

  const filtered =
    active === "all"
      ? products
      : products.filter((product) => product.category === active);
  const visible = filtered.slice(0, 8);

  return (
    <section className="bg-base-100 py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Fresh from the kitchen"
          title="Our Regular Menu Pack"
          description="Pick a category and build your order. Every dish is prepared to order and packed to travel well."
          action={
            <Link
              href="/menu"
              className="btn btn-outline border-base-300 rounded-full font-semibold"
            >
              View full menu <ArrowRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`btn btn-sm rounded-full font-semibold ${
                active === tab.id
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
              aria-pressed={active === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-8 rounded-box border border-dashed border-base-300 p-8 text-center text-sm text-base-content/70">
            No dishes in this category yet — try another one.
          </p>
        ) : null}
      </div>
    </section>
  );
}
