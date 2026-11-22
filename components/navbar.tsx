"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions";
import { useSession } from "@/lib/use-database";
import { buttonClass } from "./ui";

export function Navbar() {
  const { ready, user } = useSession();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login?loggedOut=1");
  }

  const dashboardHref = user?.role === "coordinator" ? "/coordinator/dashboard" : "/volunteer/dashboard";

  return (
    <header className="border-b border-border bg-background">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
            VH
          </span>
          VolunteerHub
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {ready && user ? (
            <>
              <span className="hidden text-muted sm:inline">
                {user.fullName} <span className="capitalize">({user.role})</span>
              </span>
              <Link href={dashboardHref} className={buttonClass("secondary", "sm")}>
                Dashboard
              </Link>
              <button type="button" onClick={handleLogout} className={buttonClass("primary", "sm")}>
                Logout
              </button>
            </>
          ) : ready ? (
            <>
              <Link href="/register/volunteer" className="px-2 py-1.5 font-medium hover:text-primary">
                Volunteer Sign Up
              </Link>
              <Link href="/register/coordinator" className="px-2 py-1.5 font-medium hover:text-primary">
                Coordinator Sign Up
              </Link>
              <Link href="/login" className={buttonClass("primary", "sm")}>
                Login
              </Link>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
