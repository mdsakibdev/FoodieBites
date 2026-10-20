import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/foodiebites";
const dbName = process.env.MONGODB_DB ?? "foodiebites";

declare global {
  var _foodieBitesMongoClient: MongoClient | undefined;
}

/**
 * One shared MongoClient, cached on globalThis so dev hot reloads do not open a
 * new connection pool. The driver connects lazily on the first operation, so
 * importing this module never opens a socket and `next build` does not need a
 * running database.
 */
export function getMongoClient(): MongoClient {
  if (!global._foodieBitesMongoClient) {
    global._foodieBitesMongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
  }
  return global._foodieBitesMongoClient;
}

export function getDb(): Db {
  return getMongoClient().db(dbName);
}

export const MONGODB_DATABASE = dbName;
