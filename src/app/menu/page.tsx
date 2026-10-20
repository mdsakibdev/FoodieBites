import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { CategoryPills } from "@/components/products/category-pills";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductGridSkeleton } from "@/components/ui/skeletons";
import { CATEGORIES } from "@/data/products";
import { getProducts } from "@/lib/products";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse all fifteen FoodieBites dishes — pasta, pizza, tacos, curries, sandwiches, smoothies and more.",
};

type MenuPageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

function MenuResultsSkeleton() {
  return (
    <>
      <div className="skeleton h-12 w-full max-w-xl rounded-full" />
      <div className="mt-6 skeleton h-9 w-2/3 max-w-md" />
      <div className="mt-8">
        <ProductGridSkeleton count={8} />
      </div>
    </>
  );
}

async function MenuResults({
  searchParams,
}: {
  searchParams: MenuPageProps["searchParams"];
}) {
  const { category, q } = await searchParams;
  const products = await getProducts();

  const activeCategory = CATEGORIES.some((item) => item.id === category)
    ? (category as CategoryId)
    : undefined;
  const query = q?.trim().toLowerCase() ?? "";

  const filtered = products.filter((product) => {
    const matchesCategory =
      !activeCategory || product.category === activeCategory;
    if (!matchesCategory) return false;
    if (!query) return true;
    return [product.name, product.shortDescription, product.category]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <>
      <form
        action="/menu"
        className="flex w-full max-w-xl items-center gap-2 rounded-full border border-base-300 bg-base-100 p-2 shadow-soft"
      >
        {activeCategory ? (
          <input type="hidden" name="category" value={activeCategory} />
        ) : null}
        <Search className="ml-3 size-5 shrink-0 text-base-content/50" />
        <label className="sr-only" htmlFor="menu-search">
          Search the menu
        </label>
        <input
          id="menu-search"
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Search dishes or drinks"
          className="input input-ghost w-full border-0 bg-transparent px-0 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="btn btn-primary shrink-0 rounded-full px-6 font-semibold"
        >
          Search
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <CategoryPills active={activeCategory} query={q} />
        <p className="text-sm font-semibold text-base-content/60">
          {filtered.length} dish{filtered.length === 1 ? "" : "es"}
        </p>
      </div>

      <div className="mt-8">
        <ProductGrid products={filtered} />
      </div>
    </>
  );
}

export default function MenuPage({ searchParams }: MenuPageProps) {
  return (
    <>
      <header className="bg-cream">
        <div className="container-page py-12 lg:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            Our menu
          </span>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Fresh food, made to order
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-content/70 sm:text-base">
            Fifteen dishes across six categories — from wood-fired pizza and
            slow-cooked curries to crisp appetizers and cold drinks. Filter,
            search and add straight to your cart.
          </p>
        </div>
      </header>

      <div className="container-page py-10 lg:py-12">
        <Suspense fallback={<MenuResultsSkeleton />}>
          <MenuResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
