"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RoleGuard } from "@/components/role-guard";
import { LoadingState } from "@/components/ui";
import { VolunteerDashboard } from "@/components/volunteer-dashboard";

function Content() {
  const welcome = useSearchParams().get("welcome") === "1";
  return <RoleGuard role="volunteer">{(user) => <VolunteerDashboard user={user} welcome={welcome} />}</RoleGuard>;
}

export default function VolunteerDashboardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Content />
    </Suspense>
  );
}
