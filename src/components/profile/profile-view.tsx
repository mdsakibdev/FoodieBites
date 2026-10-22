"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  LogOut,
  Mail,
  ShoppingBag,
  UserRound,
  Wallet,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { UserAvatar } from "@/components/ui/user-avatar";
import { authClient } from "@/lib/auth-client";
import { formatPrice } from "@/lib/format";

const memberFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Accept direct HTTPS image links and local public paths such as `/images/me.jpg`. */
function isAcceptableImageUrl(value: string): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function ProfileView({
  name: initialName,
  email,
  image,
  createdAt,
}: {
  name: string;
  email: string;
  image?: string | null;
  createdAt: string;
}) {
  const router = useRouter();
  const { count, subtotal } = useCart();

  const [name, setName] = useState(initialName);
  const [imageUrl, setImageUrl] = useState(image ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedName) {
      setProfileMessage({
        tone: "error",
        text: "Please enter your name.",
      });
      return;
    }

    if (trimmedImageUrl && !isAcceptableImageUrl(trimmedImageUrl)) {
      setProfileMessage({
        tone: "error",
        text: "Use an https:// image link or a path that starts with /.",
      });
      return;
    }

    setSavingProfile(true);
    setProfileMessage(null);
    const { error } = await authClient.updateUser({
      name: trimmedName,
      image: trimmedImageUrl || null,
    });
    setSavingProfile(false);
    if (error) {
      setProfileMessage({
        tone: "error",
        text: error.message ?? "Could not update your profile.",
      });
      return;
    }
    setName(trimmedName);
    setImageUrl(trimmedImageUrl);
    setProfileMessage({ tone: "success", text: "Profile updated." });
    router.refresh();
  }

  async function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        tone: "error",
        text: "New passwords do not match.",
      });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({
        tone: "error",
        text: "Use at least 8 characters.",
      });
      return;
    }

    setSavingPassword(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: false,
    });
    setSavingPassword(false);

    if (error) {
      setPasswordMessage({
        tone: "error",
        text: error.message ?? "Could not change your password.",
      });
      return;
    }

    setPasswordMessage({ tone: "success", text: "Password changed." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const memberSince = memberFormat.format(new Date(createdAt));

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 rounded-box border border-base-300 bg-base-100 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={name}
            image={image}
            className="size-16 text-2xl ring-4 ring-primary/15"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-ink">{name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/65">
              <Mail className="size-3.5" /> {email}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-base-content/50">
              <CalendarDays className="size-3.5" /> Member since {memberSince}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="btn btn-outline border-base-300 rounded-full"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-soft">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <ShoppingBag className="size-5" />
          </span>
          <p className="mt-3 text-2xl font-extrabold text-ink">{count}</p>
          <p className="text-xs text-base-content/60">Items in your cart</p>
        </div>
        <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-soft">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary/15 text-secondary">
            <Wallet className="size-5" />
          </span>
          <p className="mt-3 text-2xl font-extrabold text-ink">
            {formatPrice(subtotal)}
          </p>
          <p className="text-xs text-base-content/60">Current cart value</p>
        </div>
        <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-soft">
          <span className="grid size-10 place-items-center rounded-xl bg-success/15 text-success">
            <CheckCircle2 className="size-5" />
          </span>
          <p className="mt-3 text-2xl font-extrabold text-ink">Active</p>
          <p className="text-xs text-base-content/60">Account status</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={saveProfile}
          className="rounded-box border border-base-300 bg-base-100 p-6 shadow-soft"
        >
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
            <UserRound className="size-5 text-primary" /> Account details
          </h2>
          <p className="mt-1 text-sm text-base-content/65">
            This name is shown on your orders and reviews.
          </p>

          {profileMessage ? (
            <div
              role="status"
              className={`alert mt-4 text-sm ${
                profileMessage.tone === "success"
                  ? "alert-success"
                  : "alert-error"
              }`}
            >
              <span>{profileMessage.text}</span>
            </div>
          ) : null}

          <label className="form-control mt-4 w-full">
            <span className="label-text mb-1 font-semibold">Full name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="input input-bordered w-full rounded-xl"
            />
          </label>

          <div className="mt-4 rounded-xl border border-base-300 bg-base-200/40 p-3">
            <div className="flex items-center gap-3">
              <UserAvatar
                key={imageUrl}
                name={name}
                image={imageUrl.trim() || null}
                className="size-14 shrink-0 text-xl ring-2 ring-primary/20"
              />
              <label className="form-control min-w-0 flex-1">
                <span className="label-text mb-1 font-semibold">
                  Profile photo URL
                </span>
                <input
                  type="text"
                  inputMode="url"
                  spellCheck={false}
                  maxLength={2048}
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered w-full rounded-xl"
                />
              </label>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-base-content/60">
                Use a direct https:// image link. Leave blank to use your
                initial.
              </p>
              {imageUrl ? (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="btn btn-ghost btn-xs shrink-0"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <label className="form-control mt-4 w-full">
            <span className="label-text mb-1 font-semibold">Email</span>
            <input
              readOnly
              value={email}
              className="input input-bordered w-full cursor-not-allowed rounded-xl bg-base-200"
            />
          </label>

          <button
            type="submit"
            disabled={savingProfile || name.trim().length === 0}
            className="btn btn-primary mt-5 rounded-full"
          >
            {savingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </button>
        </form>

        <form
          onSubmit={savePassword}
          className="rounded-box border border-base-300 bg-base-100 p-6 shadow-soft"
        >
          <h2 className="text-lg font-extrabold text-ink">Change password</h2>
          <p className="mt-1 text-sm text-base-content/65">
            Pick something long and unique that you do not use elsewhere.
          </p>

          {passwordMessage ? (
            <div
              role="status"
              className={`alert mt-4 text-sm ${
                passwordMessage.tone === "success"
                  ? "alert-success"
                  : "alert-error"
              }`}
            >
              <span>{passwordMessage.text}</span>
            </div>
          ) : null}

          <div className="mt-4 space-y-3">
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Current password
              </span>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="input input-bordered w-full rounded-xl"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                New password
              </span>
              <input
                required
                minLength={8}
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="input input-bordered w-full rounded-xl"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Confirm new password
              </span>
              <input
                required
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="input input-bordered w-full rounded-xl"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="btn btn-outline mt-5 rounded-full border-base-300"
          >
            {savingPassword ? <Loader2 className="size-4 animate-spin" /> : null}
            Update password
          </button>
        </form>
      </div>

      <p className="text-sm text-base-content/60">
        Ready to eat?{" "}
        <Link href="/menu" className="font-semibold text-primary hover:underline">
          Browse the menu
        </Link>{" "}
        or{" "}
        <Link href="/cart" className="font-semibold text-primary hover:underline">
          review your cart
        </Link>
        .
      </p>
    </div>
  );
}
