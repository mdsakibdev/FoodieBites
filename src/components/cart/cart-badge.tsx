"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartBadge({ className = "" }: { className?: string }) {
  const { count, ready } = useCart();

  return (
    <Link
      href="/cart"
      className={`btn btn-ghost btn-circle relative ${className}`}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingBag className="size-5" />
      {ready && count > 0 ? (
        <span className="badge badge-primary badge-sm absolute -right-0.5 -top-0.5 font-bold">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
