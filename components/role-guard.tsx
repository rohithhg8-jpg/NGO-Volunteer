"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSession } from "@/lib/use-database";
import type { Role, User } from "@/lib/types";
import { Alert, buttonClass, LoadingState } from "./ui";

export function RoleGuard({ role, children }: { role: Role; children: (user: User) => ReactNode }) {
  const { ready, user } = useSession();

  if (!ready) return <LoadingState />;

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <Alert type="error">Please log in to access this page.</Alert>
        <Link href="/login" className={buttonClass()}>
          Go to Login
        </Link>
      </div>
    );
  }

  if (user.role !== role) {
    const otherDashboard = user.role === "coordinator" ? "/coordinator/dashboard" : "/volunteer/dashboard";
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <Alert type="error">
          This page is only for {role} accounts. You are logged in as a {user.role}.
        </Alert>
        <Link href={otherDashboard} className={buttonClass()}>
          Go to my dashboard
        </Link>
      </div>
    );
  }

  return <>{children(user)}</>;
}
