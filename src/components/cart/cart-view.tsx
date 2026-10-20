"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/products/quantity-stepper";
import { CartSkeleton } from "@/components/ui/skeletons";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const {
    items,
    count,
    subtotal,
    ready,
    busy,
    updateQuantity,
    removeItem,
    clear,
  } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [placed, setPlaced] = useState(false);

  const deliveryFee = subtotal >= 30 || subtotal === 0 ? 0 : 3.5;
  const tax = Math.round(subtotal * 8) / 100;
  const total = subtotal + deliveryFee + tax;

  async function handleCheckout() {
    setCheckingOut(true);
    // Demo checkout: a real implementation would create an order document and
    // start a payment flow before clearing the cart.
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    await clear();
    setCheckingOut(false);
    setPlaced(true);
  }

  if (!ready) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-box border border-base-300 bg-base-100 p-10 text-center shadow-soft">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
          {placed ? (
            <CheckCircle2 className="size-8" />
          ) : (
            <ShoppingBag className="size-8" />
          )}
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-ink">
          {placed ? "Order placed — thank you!" : "Your cart is empty"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-base-content/70">
          {placed
            ? "This is a demo checkout, so no payment was taken. Your cart has been cleared and your order would now be on its way."
            : "Add a few dishes from the menu and they will show up here, saved to your account."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/menu" className="btn btn-primary rounded-full px-6">
            Browse the menu <ArrowRight className="size-4" />
          </Link>
          <Link href="/profile" className="btn btn-ghost rounded-full">
            View dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-base-content/70">
            {count} item{count === 1 ? "" : "s"} in your cart
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm rounded-full text-error"
            onClick={() => clear()}
            disabled={busy}
          >
            <Trash2 className="size-4" /> Clear cart
          </button>
        </div>

        {items.map((item) => (
          <article
            key={item.productId}
            className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-4 shadow-soft sm:flex-row sm:items-center"
          >
            <Link
              href={`/products/${item.productId}`}
              className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-cream"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.productId}`}
                className="truncate text-base font-bold text-ink hover:text-primary"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-xs text-base-content/60">
                {formatPrice(item.price)} each
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-error/80 hover:text-error"
              >
                <Trash2 className="size-3" /> Remove
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <QuantityStepper
                quantity={item.quantity}
                onChange={(next) => updateQuantity(item.productId, next)}
                onRemove={() => removeItem(item.productId)}
              />
              <span className="text-base font-extrabold text-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </article>
        ))}
      </div>

      <aside className="rounded-box border border-base-300 bg-base-100 p-6 shadow-soft lg:sticky lg:top-24">
        <h2 className="text-lg font-extrabold text-ink">Order summary</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-base-content/70">Subtotal</dt>
            <dd className="font-semibold">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-base-content/70">Delivery</dt>
            <dd className="font-semibold">
              {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-base-content/70">Tax (8%)</dt>
            <dd className="font-semibold">{formatPrice(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-base-300 pt-3 text-base">
            <dt className="font-bold text-ink">Total</dt>
            <dd className="font-extrabold text-ink">{formatPrice(total)}</dd>
          </div>
        </dl>

        {deliveryFee > 0 ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-primary/10 p-3 text-xs text-base-content/75">
            <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
            Add {formatPrice(30 - subtotal)} more to unlock free delivery.
          </p>
        ) : (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-success/10 p-3 text-xs text-base-content/75">
            <Truck className="mt-0.5 size-4 shrink-0 text-success" />
            Free delivery applied to this order.
          </p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={checkingOut || busy}
          className="btn btn-primary mt-5 w-full rounded-full font-semibold"
        >
          {checkingOut ? <Loader2 className="size-4 animate-spin" /> : null}
          {checkingOut ? "Placing order…" : "Checkout"}
        </button>
        <p className="mt-3 text-center text-[11px] text-base-content/50">
          Demo checkout — no payment is taken.
        </p>
        <Link
          href="/menu"
          className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Continue shopping <ArrowRight className="size-3.5" />
        </Link>
      </aside>
    </div>
  );
}
