import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a FoodieBites account to order, save dishes and track your cart.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for ordering, reservations and your saved cart. It only takes a moment."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="skeleton h-96 w-full rounded-box" />}>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  );
}
