import { NextResponse } from "next/server";
import { z } from "zod";
import {
  addItem,
  clearCart,
  getCart,
  getCurrentUser,
  setQuantity,
  toPayload,
} from "@/lib/cart";
import { findProduct } from "@/lib/products";

const itemSchema = z.object({
  productId: z.string().min(1).max(120),
  quantity: z.number().int().min(1).max(20),
});

const updateSchema = z.object({
  productId: z.string().min(1).max(120),
  quantity: z.number().int().min(0).max(20),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cart = await getCart(user.id);
  return NextResponse.json(toPayload(cart));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = itemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const product = await findProduct(parsed.data.productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const cart = await addItem(
    user.id,
    {
      productId: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    },
    parsed.data.quantity,
  );

  return NextResponse.json(toPayload(cart));
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const cart = await setQuantity(
    user.id,
    parsed.data.productId,
    parsed.data.quantity,
  );
  return NextResponse.json(toPayload(cart));
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cart = await clearCart(user.id);
  return NextResponse.json(toPayload(cart));
}
