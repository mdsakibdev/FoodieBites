import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
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

/**
 * Resolve the public URL Better Auth uses for cookies, redirects and origin
 * validation.
 *
 * - `BETTER_AUTH_URL` wins (production sets it to the stable Vercel alias).
 * - On preview deployments `VERCEL_URL` is the current deployment hostname.
 * - Local development falls back to localhost.
 */
function resolveBaseURL(): string {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

const baseURL = resolveBaseURL();

/**
 * Origins allowed to call the auth endpoints. The wildcard covers Vercel
 * preview and deployment-specific hostnames; the explicit aliases keep the
 * production and team domains working even if `BETTER_AUTH_URL` is unset.
 */
const trustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://foodie-bites-tau.vercel.app",
  "https://foodie-bites-fghr.vercel.app",
  "https://foodie-bites*.vercel.app",
  baseURL,
];

export const auth = betterAuth({
  appName: "FoodieBites",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(client.db(MONGODB_DATABASE), { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  trustedOrigins,
  // Must be the last plugin. In addition to route handlers, this lets auth
  // calls made from server actions write cookies through `next/headers`.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
