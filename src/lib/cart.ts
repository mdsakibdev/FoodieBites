import { headers } from "next/headers";
import { auth } from "./auth";
import { getDb } from "./mongodb";
import type { Cart, CartLine, CartPayload } from "./types";

const COLLECTION = "carts";
const MAX_QUANTITY = 20;

interface CartDoc {
  userId: string;
  items: CartLine[];
  updatedAt: Date;
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

function summarize(userId: string, items: CartLine[]): Cart {
  return { userId, items, updatedAt: new Date().toISOString() };
}

export function toPayload(cart: Cart | CartDoc): CartPayload {
  return {
    items: cart.items,
    count: cart.items.reduce((total, line) => total + line.quantity, 0),
    subtotal: cart.items.reduce(
      (total, line) => total + line.price * line.quantity,
      0,
    ),
  };
}

async function readCartDoc(userId: string): Promise<CartDoc> {
  const db = getDb();
  const doc = await db
    .collection<CartDoc>(COLLECTION)
    .findOne({ userId });
  return doc ?? { userId, items: [], updatedAt: new Date() };
}

async function saveCart(userId: string, items: CartLine[]): Promise<CartDoc> {
  const doc: CartDoc = { userId, items, updatedAt: new Date() };
  await getDb()
    .collection<CartDoc>(COLLECTION)
    .updateOne({ userId }, { $set: doc }, { upsert: true });
  return doc;
}

export async function getCart(userId: string): Promise<Cart> {
  const doc = await readCartDoc(userId);
  return summarize(doc.userId, doc.items);
}

export async function addItem(
  userId: string,
  line: CartLine,
  quantity: number,
): Promise<Cart> {
  const doc = await readCartDoc(userId);
  const existing = doc.items.find((item) => item.productId === line.productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
    existing.price = line.price;
  } else {
    doc.items.push({
      ...line,
      quantity: Math.min(Math.max(quantity, 1), MAX_QUANTITY),
    });
  }
  const saved = await saveCart(userId, doc.items);
  return summarize(saved.userId, saved.items);
}

export async function setQuantity(
  userId: string,
  productId: string,
  quantity: number,
): Promise<Cart> {
  const doc = await readCartDoc(userId);
  const items =
    quantity <= 0
      ? doc.items.filter((item) => item.productId !== productId)
      : doc.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
            : item,
        );
  const saved = await saveCart(userId, items);
  return summarize(saved.userId, saved.items);
}

export async function removeItem(
  userId: string,
  productId: string,
): Promise<Cart> {
  return setQuantity(userId, productId, 0);
}

export async function clearCart(userId: string): Promise<Cart> {
  const saved = await saveCart(userId, []);
  return summarize(saved.userId, saved.items);
}
