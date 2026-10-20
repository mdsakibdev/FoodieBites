export function ProductCardSkeleton() {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-soft">
      <div className="skeleton h-40 w-full rounded-2xl" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="skeleton h-5 w-16" />
        <div className="skeleton h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-4"
        >
          <div className="skeleton size-20 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-3 w-1/4" />
          </div>
          <div className="skeleton h-9 w-28 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container-page py-16">
      <div className="skeleton h-8 w-52" />
      <div className="mt-6 skeleton h-64 w-full rounded-box" />
    </div>
  );
}
