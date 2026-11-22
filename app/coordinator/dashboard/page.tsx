"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CoordinatorDashboard } from "@/components/coordinator-dashboard";
import { RoleGuard } from "@/components/role-guard";
import { LoadingState } from "@/components/ui";

function Content() {
  const welcome = useSearchParams().get("welcome") === "1";
  return <RoleGuard role="coordinator">{(user) => <CoordinatorDashboard user={user} welcome={welcome} />}</RoleGuard>;
}

export default function CoordinatorDashboardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Content />
    </Suspense>
  );
}
