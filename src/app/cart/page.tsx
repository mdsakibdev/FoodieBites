import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the dishes in your FoodieBites cart and check out.",
};

export default function CartPage() {
  return (
    <div className="container-page py-10 lg:py-12">
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 transition hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Continue shopping
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Your cart
      </h1>
      <p className="mt-2 text-sm text-base-content/65">
        Saved to your account, so your order is waiting on every device.
      </p>

      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
