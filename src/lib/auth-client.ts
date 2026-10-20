import { createAuthClient } from "better-auth/react";

/**
 * Browser auth client. `useSession()` is reactive: components re-render after
 * sign-in / sign-out without a manual refresh.
 *
 * No `baseURL` on purpose: the browser calls the app's own `/api/auth/*`
 * routes, and `BETTER_AUTH_URL` is a server-only variable (it is not exposed
 * to client bundles).
 */
export const authClient = createAuthClient();
