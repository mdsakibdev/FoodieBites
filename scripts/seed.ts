import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";
import { PRODUCTS } from "../src/data/products";

/** Minimal .env.local loader so the seed script works without extra deps. */
function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/foodiebites";
const dbName = process.env.MONGODB_DB ?? "foodiebites";

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
await client.connect();

try {
  const collection = client
    .db(dbName)
    .collection<(typeof PRODUCTS)[number] & { _id: string }>("products");

  const slugs = PRODUCTS.map((product) => product.slug);

  const result = await collection.bulkWrite(
    PRODUCTS.map((product) => ({
      replaceOne: {
        filter: { _id: product.slug },
        replacement: { _id: product.slug, ...product },
        upsert: true,
      },
    })),
  );

  const removed = await collection.deleteMany({ slug: { $nin: slugs } });

  console.log(
    `Seeded ${dbName}.products: ${result.upsertedCount} inserted, ${result.modifiedCount} updated, ${removed.deletedCount} removed.`,
  );
} finally {
  await client.close();
}
