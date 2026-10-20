import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile/profile-view";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your FoodieBites profile, password and saved cart.",
};

async function ProfileGate() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?next=/profile");
  }

  return (
    <div className="container-page py-10 lg:py-12">
      <ProfileView
        name={session.user.name}
        email={session.user.email}
        createdAt={new Date(session.user.createdAt).toISOString()}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-12">
          <div className="skeleton h-48 w-full rounded-box" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="skeleton h-28 rounded-box" />
            <div className="skeleton h-28 rounded-box" />
            <div className="skeleton h-28 rounded-box" />
          </div>
        </div>
      }
    >
      <ProfileGate />
    </Suspense>
  );
}
