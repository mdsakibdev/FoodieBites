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
    <div className="space-y-5">
      {/* OAuth Callback Error */}
      {callbackError ? (
        <div role="alert" className="alert alert-error text-sm rounded-xl">
          <AlertCircle className="size-4 shrink-0" />
          <span>{callbackError}</span>
        </div>
      ) : null}

      {/* Google Auth Button */}
      {googleEnabled ? (
        <GoogleAuthButton
          next={target}
          errorCallbackURL={errorCallbackURL}
          dividerLabel="or sign in with email"
        />
      ) : null}

      {/* Main Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sign In Error Alert */}
        {error ? (
          <div role="alert" className="alert alert-error text-sm rounded-xl">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Email Input Field */}
        <div className="form-control w-full">
          <label htmlFor="email" className="label-text mb-1.5 font-medium text-ink">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-base-content/40" />
            <input
              id="email"
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="input input-bordered w-full rounded-xl pl-10.5 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Password Input Field */}
        <div className="form-control w-full">
          <label htmlFor="password" className="label-text mb-1.5 font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-base-content/40" />
            <input
              id="password"
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full rounded-xl pl-10.5 pr-11 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-base-content/50 transition-colors hover:text-ink focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary w-full rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.99]"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}