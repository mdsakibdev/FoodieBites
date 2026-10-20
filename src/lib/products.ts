import { connection } from "next/server";
import { PRODUCTS } from "@/data/products";
import { getDb } from "./mongodb";
import type { Product } from "./types";

const COLLECTION = "products";

type ProductDoc = Product & { _id?: string };

/**
 * Reads the catalogue from MongoDB, falling back to the bundled seed data when
 * the database is empty or unreachable so the site always renders.
 */
async function loadProducts(): Promise<Product[]> {
  try {
    const db = getDb();
    const docs = await db.collection<ProductDoc>(COLLECTION).find({}).toArray();
    if (docs.length > 0) {
      return docs.map((doc) => doc as Product);
    }
    console.warn(
      "[products] MongoDB returned no products. Run `npm run seed` to populate the catalogue.",
    );
  } catch (error) {
    console.warn(
      `[products] MongoDB unavailable, using bundled catalogue: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  return PRODUCTS;
}

/**
 * `connection()` keeps these queries out of prerendering, which means
 * `next build` succeeds without a running database.
 */
export async function getProducts(): Promise<Product[]> {
  await connection();
  return loadProducts();
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  await connection();
  const products = await loadProducts();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connection();
  const products = await loadProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(
  slug: string,
  category: Product["category"],
  limit = 3,
): Promise<Product[]> {
  await connection();
  const products = await loadProducts();
  return products
    .filter((product) => product.slug !== slug && product.category === category)
    .slice(0, limit);
}

/** Used by route handlers, where `connection()` is not needed. */
export async function findProduct(slug: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
