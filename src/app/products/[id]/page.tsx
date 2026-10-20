import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Flame, Leaf, Truck } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { Stars } from "@/components/ui/stars";
import { PageSkeleton } from "@/components/ui/skeletons";
import { CATEGORIES } from "@/data/products";
import { formatPrice, formatRating } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Dish details",
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

async function ProductDetails({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.slug, product.category);
  const category =
    CATEGORIES.find((item) => item.id === product.category)?.label ??
    product.category;

  return (
    <div className="container-page py-10 lg:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-base-content/60"
      >
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/menu" className="hover:text-primary">
          Menu
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-semibold text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border-8 border-base-100 bg-cream shadow-soft">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {product.featured ? (
            <span className="badge badge-primary absolute left-4 top-4 rounded-full px-4 py-3 text-xs font-bold uppercase tracking-wide">
              Bestseller
            </span>
          ) : null}
        </div>

        <div>
          <span className="badge badge-ghost rounded-full px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-base-content/70">
            {category}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Stars rating={product.rating} size={16} />
            <span className="text-sm font-semibold text-ink">
              {formatRating(product.rating)}
            </span>
            <span className="text-sm text-base-content/55">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-base-content/75 sm:text-base">
            {product.description}
          </p>

          <p className="mt-5 text-3xl font-extrabold text-primary">
            {formatPrice(product.price)}
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-3">
              <Clock className="mx-auto size-4 text-primary" />
              <dt className="mt-1 text-[11px] uppercase tracking-wide text-base-content/50">
                Prep time
              </dt>
              <dd className="text-sm font-bold text-ink">{product.prepTime}</dd>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-100 p-3">
              <Flame className="mx-auto size-4 text-secondary" />
              <dt className="mt-1 text-[11px] uppercase tracking-wide text-base-content/50">
                Calories
              </dt>
              <dd className="text-sm font-bold text-ink">
                {product.calories} kcal
              </dd>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-100 p-3">
              <Leaf className="mx-auto size-4 text-success" />
              <dt className="mt-1 text-[11px] uppercase tracking-wide text-base-content/50">
                Fresh
              </dt>
              <dd className="text-sm font-bold text-ink">Daily</dd>
            </div>
          </dl>

          <ProductPurchasePanel
            productId={product.slug}
            price={product.price}
          />

          <p className="mt-5 flex items-center gap-2 text-xs text-base-content/60">
            <Truck className="size-4 text-primary" /> Free delivery on orders
            over $30 · packed to stay hot
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-soft">
          <h2 className="text-lg font-extrabold text-ink">Ingredients</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Everything that goes into this plate.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="badge badge-outline rounded-full border-base-300 px-4 py-3 text-sm font-medium"
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-soft">
          <h2 className="text-lg font-extrabold text-ink">Why you&apos;ll love it</h2>
          <ul className="mt-4 space-y-3 text-sm text-base-content/75">
            <li className="flex gap-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              Cooked to order by our kitchen team, never held under a lamp.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              Seasonal produce sourced from local suppliers each morning.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              Packed in recyclable containers that keep the food hot.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              Add it to your cart and reorder in one tap next time.
            </li>
          </ul>
        </section>
      </div>

      {related.length > 0 ? (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                More like this
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">
                You might also like
              </h2>
            </div>
            <Link
              href={`/menu?category=${product.category}`}
              className="btn btn-ghost btn-sm rounded-full"
            >
              See all
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
