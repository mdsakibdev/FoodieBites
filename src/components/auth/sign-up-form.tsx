"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { oauthErrorMessage } from "@/components/auth/oauth-error";

export function SignUpForm({
  googleEnabled = false,
}: {
  googleEnabled?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/profile";
  const target =
    next.startsWith("/") && !next.startsWith("//") ? next : "/profile";
  const callbackError = oauthErrorMessage(searchParams.get("error"));
  const errorCallbackURL =
    target === "/profile"
      ? "/sign-up"
      : `/sign-up?next=${encodeURIComponent(target)}`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setPending(true);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (signUpError) {
        setError(
          signUpError.message ||
            signUpError.statusText ||
            "Unable to create your account. Please try again.",
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
          dividerLabel="or sign up with email"
        />
      ) : null}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sign Up Error Alert */}
        {error ? (
          <div role="alert" className="alert alert-error text-sm rounded-xl">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Full Name Field */}
        <div className="form-control w-full">
          <label htmlFor="name" className="label-text mb-1.5 font-medium text-ink">
            Full name
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-base-content/40" />
            <input
              id="name"
              required
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Morgan"
              className="input input-bordered w-full rounded-xl pl-10.5 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Email Field */}
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

        {/* Password & Confirm Password Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Password */}
          <div className="form-control w-full">
            <label htmlFor="password" className="label-text mb-1.5 font-medium text-ink">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-base-content/40" />
              <input
                id="password"
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Min. 8 chars"
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

          {/* Confirm Password */}
          <div className="form-control w-full">
            <label htmlFor="confirmPassword" className="label-text mb-1.5 font-medium text-ink">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-base-content/40" />
              <input
                id="confirmPassword"
                required
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat password"
                className={`input input-bordered w-full rounded-xl pl-10.5 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  passwordMismatch ? "input-error" : ""
                }`}
              />
            </div>
            {passwordMismatch ? (
              <span className="mt-1 text-xs text-error">
                Passwords do not match.
              </span>
            ) : null}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={pending || passwordMismatch}
            className="btn btn-primary w-full rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.99]"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}