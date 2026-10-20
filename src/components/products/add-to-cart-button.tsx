"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Loader2, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { authClient } from "@/lib/auth-client";

export function AddToCartButton({
  productId,
  quantity = 1,
  label = "Add Cart",
  compact = false,
  className = "",
}: {
  productId: string;
  quantity?: number;
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { addItem } = useCart();
  const { data: session } = authClient.useSession();
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    if (!session) {
      router.push(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setPending(true);
    try {
      await addItem(productId, quantity);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1600);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`btn btn-primary rounded-full font-semibold ${compact ? "btn-sm" : ""} ${className}`}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : added ? (
        <Check className="size-4" />
      ) : (
        <Plus className="size-4" />
      )}
      <span>{added ? "Added" : label}</span>
    </button>
  );
}
