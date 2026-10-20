"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart-button";
import { QuantityStepper } from "./quantity-stepper";

export function ProductPurchasePanel({
  productId,
  price,
}: {
  productId: string;
  price: number;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-base-content/55">
            Quantity
          </p>
          <QuantityStepper quantity={quantity} onChange={setQuantity} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-base-content/55">
            Total
          </p>
          <p className="text-xl font-extrabold text-ink">
            {formatPrice(price * quantity)}
          </p>
        </div>
      </div>

      <AddToCartButton
        productId={productId}
        quantity={quantity}
        label="Add to cart"
        className="w-full py-3 text-base"
      />
    </div>
  );
}
