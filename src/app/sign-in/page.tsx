import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your FoodieBites account.",
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to view dish details, keep a cart synced across devices and manage your orders."
      footer={
        <>
          New to FoodieBites?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="skeleton h-72 w-full rounded-box" />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
