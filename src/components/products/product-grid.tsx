import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-12 text-center">
        <p className="text-lg font-bold text-ink">No dishes found</p>
        <p className="mt-2 text-sm text-base-content/70">
          Try another category or clear your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
