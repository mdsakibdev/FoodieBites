"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.91a6.01 6.01 0 0 1 0-3.82V7.5H3.06a10 10 0 0 0 0 9l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.94 5.5l3.35 2.59C7.2 7.73 9.4 5.97 12 5.97Z"
      />
    </svg>
  );
}

/**
 * Starts the Google OAuth flow. Only rendered when the server has Google
 * credentials configured, so users never see a button that cannot work.
 */
export function GoogleAuthButton({
  next = "/",
  errorCallbackURL,
  label = "Continue with Google",
  dividerLabel = "or continue with email",
}: {
  next?: string;
  errorCallbackURL: string;
  label?: string;
  dividerLabel?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setPending(true);

    const target =
      next.startsWith("/") && !next.startsWith("//") ? next : "/";

    try {
      const { data, error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: target,
        errorCallbackURL,
      });

      if (socialError) {
        setError(
          socialError.message ||
            socialError.statusText ||
            "Google sign-in could not be started.",
        );
        setPending(false);
        return;
      }

      // Normally the client redirects automatically. This is a fallback for
      // cases where the authorize URL is returned without an automatic redirect.
      if (data && "url" in data && typeof data.url === "string" && data.url) {
        window.location.assign(data.url);
      }
    } catch {
      setError(
        "We couldn't reach Google. Check your connection and try again.",
      );
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="btn btn-outline w-full rounded-full border-base-300 bg-base-100 font-semibold hover:border-primary hover:bg-primary/5"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        {pending ? "Connecting to Google..." : label}
      </button>

      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}

      <div className="divider my-0 text-xs font-medium text-base-content/50">
        {dividerLabel}
      </div>
    </div>
  );
}
