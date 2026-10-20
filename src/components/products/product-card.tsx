"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { CATEGORIES } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart-button";

function categoryLabel(category: Product["category"]) {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-40 w-full overflow-hidden rounded-2xl bg-cream"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-ghost badge-sm text-[11px] font-semibold uppercase tracking-wide text-base-content/70">
            {categoryLabel(product.category)}
          </span>
          <Stars rating={product.rating} />
        </div>

        <h3 className="mt-2 text-base font-bold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-base-content/65">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-extrabold text-ink">
            {formatPrice(product.price)}
          </span>
          <AddToCartButton productId={product.slug} compact />
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:gap-2"
        >
          View Details <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
