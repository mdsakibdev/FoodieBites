"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarPlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { CartBadge } from "@/components/cart/cart-badge";
import { NAV_LINKS } from "@/data/site";
import { authClient } from "@/lib/auth-client";

const linkClass = "text-sm font-semibold transition-colors hover:text-primary";

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * `usePathname()` is optional URL data that is unavailable while a dynamic
 * route is prerendered, so it lives behind its own Suspense boundary. The
 * fallback renders the same links without the active highlight.
 */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={onNavigate}
          className={`${linkClass} ${
            isActive(pathname, link.href)
              ? "text-primary"
              : "text-base-content/80"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

function NavLinksFallback({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={onNavigate}
          className={`${linkClass} text-base-content/80`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/90 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/menu"
            className="btn btn-ghost btn-circle hidden sm:inline-flex"
            aria-label="Search the menu"
          >
            <Search className="size-5" />
          </Link>

          <CartBadge />

          {isPending ? (
            <span className="skeleton size-9 rounded-full" />
          ) : session ? (
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
                aria-label="Account menu"
              >
                <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-content">
                  {(session.user.name?.[0] ?? "U").toUpperCase()}
                </span>
              </button>
              <ul className="dropdown-content menu z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-soft">
                <li className="menu-title text-xs">
                  {session.user.name}
                  <span className="block truncate text-[11px] font-normal opacity-60">
                    {session.user.email}
                  </span>
                </li>
                <li>
                  <Link href="/profile">
                    <LayoutDashboard className="size-4" /> My dashboard
                  </Link>
                </li>
                <li>
                  <button type="button" onClick={handleSignOut}>
                    <LogOut className="size-4" /> Sign out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="btn btn-ghost hidden items-center gap-2 text-sm font-semibold sm:inline-flex"
            >
              <UserRound className="size-4" /> Sign in
            </Link>
          )}

          <Link
            href="/#reservation"
            className="btn btn-primary hidden items-center gap-2 rounded-full px-5 text-sm font-semibold md:inline-flex"
          >
            <CalendarPlus className="size-4" /> Reserve Table
          </Link>

          <button
            type="button"
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <div className="container-page flex flex-col gap-4 py-5">
            <Suspense
              fallback={
                <NavLinksFallback onNavigate={() => setMobileOpen(false)} />
              }
            >
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </Suspense>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="btn btn-outline btn-sm rounded-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm rounded-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/sign-in"
                  className="btn btn-primary btn-sm rounded-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/#reservation"
                className="btn btn-outline btn-sm rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                <CalendarPlus className="size-4" /> Reserve Table
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
