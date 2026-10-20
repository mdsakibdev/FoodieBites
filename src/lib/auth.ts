import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "./mongodb";

/**
 * BetterAuth server instance. Email + password only, sessions persisted in
 * MongoDB by the official adapter. `nextCookies()` must stay last so cookies
 * set by server actions/route handlers are forwarded to the browser.
 */
const secret =
  process.env.BETTER_AUTH_SECRET ?? "foodiebites-development-secret-change-me";

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn(
    "[auth] BETTER_AUTH_SECRET is not set. Falling back to an insecure development secret — set it in .env.local before deploying.",
  );
}

export const auth = betterAuth({
  appName: "FoodieBites",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret,
  database: mongodbAdapter(getDb()),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
