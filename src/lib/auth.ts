import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getMongoClient, MONGODB_DATABASE } from "./mongodb";

/**
 * BetterAuth server instance. Email + password only, sessions persisted in
 * MongoDB by the official adapter.
 *
 * The client is reused from `./mongodb` so auth and app data share one
 * connection pool (and the same `MONGODB_URI` / `MONGODB_DB` settings). It
 * connects lazily, so importing this module never opens a socket.
 */
const client = getMongoClient();

export const auth = betterAuth({
  appName: "FoodieBites",
  database: mongodbAdapter(client.db(MONGODB_DATABASE), { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
});

export type Session = typeof auth.$Infer.Session;
