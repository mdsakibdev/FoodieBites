import Link from "next/link";
import { CATEGORIES } from "@/data/products";

export function CategoryPills({
  active,
  query,
}: {
  active?: string;
  query?: string;
}) {
  function href(category?: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    const search = params.toString();
    return search ? `/menu?${search}` : "/menu";
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={href()}
        className={`btn btn-sm rounded-full font-semibold ${
          !active ? "btn-primary" : "btn-outline border-base-300"
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={href(category.id)}
          className={`btn btn-sm rounded-full font-semibold ${
            active === category.id
              ? "btn-primary"
              : "btn-outline border-base-300"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}
