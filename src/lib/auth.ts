import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { getMongoClient, MONGODB_DATABASE } from "./mongodb";

/**
 * BetterAuth server instance. Email + password, plus Google OAuth when
 * `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured. Sessions are
 * persisted in MongoDB by the official adapter.
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
 * Google OAuth is enabled only when both credentials are present. This keeps
 * local development and preview deployments working when Google is not
 * configured, and hides the Google buttons on the auth pages in that case.
 *
 * Authorized redirect URI in Google Cloud:
 *   `${baseURL}/api/auth/callback/google`
 */
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const socialProviders =
  googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : undefined;

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
  socialProviders,
  account: {
    accountLinking: {
      enabled: true,
      /**
       * Google verifies the email before returning it. Email/password users
       * in this app are not marked email-verified, so allow a verified
       * Google email to link to the existing local account. Different email
       * addresses are still rejected.
       */
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
      /**
       * Copy Google's name and picture when an existing local account is
       * linked. Google sign-ins after that leave later dashboard changes
       * untouched because `overrideUserInfoOnSignIn` is not enabled.
       */
      updateUserInfoOnLink: true,
    },
  },
  trustedOrigins,
  // Must be the last plugin. In addition to route handlers, this lets auth
  // calls made from server actions write cookies through `next/headers`.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
