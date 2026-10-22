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

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/profile";

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

      const target =
        next.startsWith("/") && !next.startsWith("//") ? next : "/profile";
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div role="alert" className="alert alert-error text-sm">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      ) : null}

      <label className="form-control w-full">
        <span className="label-text mb-1 font-semibold text-ink">
          Full name
        </span>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/45" />
          <input
            required
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
            className="input input-bordered w-full rounded-xl pl-10"
          />
        </div>
      </label>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-control w-full">
          <span className="label-text mb-1 font-semibold text-ink">
            Password
          </span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/45" />
            <input
              required
              minLength={8}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Min. 8 characters"
              className="input input-bordered w-full rounded-xl pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-base-content/50 transition hover:text-primary"
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

        <label className="form-control w-full">
          <span className="label-text mb-1 font-semibold text-ink">
            Confirm
          </span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/45" />
            <input
              required
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat password"
              className={`input input-bordered w-full rounded-xl pl-10 ${
                passwordMismatch ? "input-error" : ""
              }`}
            />
          </div>
          {passwordMismatch ? (
            <span className="mt-1 text-xs text-error">
              Passwords do not match.
            </span>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={pending || passwordMismatch}
        className="btn btn-primary w-full rounded-full font-semibold"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Create account
      </button>
    </form>
  );
}
