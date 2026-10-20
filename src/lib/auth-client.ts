import { createAuthClient } from "better-auth/react";

/**
 * Browser auth client. `useSession()` is reactive: components re-render after
 * sign-in / sign-out without a manual refresh.
 */
export const authClient = createAuthClient();
