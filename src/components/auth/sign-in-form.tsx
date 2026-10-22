"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { oauthErrorMessage } from "@/components/auth/oauth-error";
import { authClient } from "@/lib/auth-client";

export function SignInForm({
  googleEnabled = false,
}: {
  googleEnabled?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const target = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const callbackError = oauthErrorMessage(searchParams.get("error"));
  const errorCallbackURL =
    target === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(target)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError(
          signInError.message ||
            signInError.statusText ||
            "Unable to sign in. Please try again.",
        );
        return;
      }

      router.push(target);
      router.refresh();
    } catch {
      setError(
        "We couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      {callbackError ? (
        <div role="alert" className="alert alert-error text-sm">
          <AlertCircle className="size-4" />
          <span>{callbackError}</span>
        </div>
      ) : null}

      {googleEnabled ? (
        <GoogleAuthButton
          next={target}
          errorCallbackURL={errorCallbackURL}
          dividerLabel="or sign in with email"
        />
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div role="alert" className="alert alert-error text-sm">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </div>
        ) : null}

        <label className="form-control w-full">
          <span className="label-text mb-1 font-semibold text-ink">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/45" />
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="input input-bordered w-full rounded-xl pl-10"
            />
          </div>
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-1 font-semibold text-ink">
            Password
          </span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/45" />
            <input
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              className="input input-bordered w-full rounded-xl pl-10 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-base-content/50 transition hover:text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary w-full rounded-full font-semibold"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Sign in
        </button>
      </form>
    </div>
  );
}
