"use client";

import Link from "next/link";
import { useState } from "react";
import { updateApplicationStatus } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import type { ApplicationStatus, User } from "@/lib/types";
import { useDatabase } from "@/lib/use-database";
import { ApplicationsTable } from "./applications-table";
import { CreateActivityForm } from "./create-activity-form";
import { Alert, buttonClass, Card, PageHeader, StatCard } from "./ui";

export function CoordinatorDashboard({ user, welcome }: { user: User; welcome: boolean }) {
  const db = useDatabase();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    welcome ? { type: "success", text: `Welcome, ${user.fullName}! Your coordinator account is ready.` } : null,
  );

  const myActivities = db.activities
    .filter((activity) => activity.coordinatorId === user.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const myActivityIds = new Set(myActivities.map((a) => a.id));
  const myApplications = db.applications.filter((app) => myActivityIds.has(app.activityId));
  const pending = myApplications.filter((app) => app.status === "Pending");

  function handleUpdate(applicationId: string, status: ApplicationStatus) {
    const result = updateApplicationStatus(applicationId, status);
    setMessage(
      result.ok
        ? { type: "success", text: `Application ${status.toLowerCase()} successfully.` }
        : { type: "error", text: result.error },
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Coordinator Dashboard" description={`${user.fullName} · ${user.organization}`}>
        <a href="#create-activity" className={buttonClass()}>
          Create Activity
        </a>
      </PageHeader>

      {message && <Alert type={message.type}>{message.text}</Alert>}

      <section aria-label="Summary" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Activities created" value={myActivities.length} />
        <StatCard label="Total applications" value={myApplications.length} />
        <StatCard label="Pending review" value={pending.length} />
        <StatCard label="Approved volunteers" value={myApplications.filter((a) => a.status === "Approved").length} />
      </section>

      <section aria-labelledby="pending-applications">
        <h2 id="pending-applications" className="mb-4 text-xl font-semibold">
          Pending applications
        </h2>
        <ApplicationsTable
          applications={pending}
          users={db.users}
          activities={myActivities}
          onUpdate={handleUpdate}
          emptyMessage="No applications are waiting for review."
        />
      </section>

      <section aria-labelledby="my-activities">
        <h2 id="my-activities" className="mb-4 text-xl font-semibold">
          My activities
        </h2>
        {myActivities.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            You have not created any activities yet. Use the form below to create your first one.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Activity</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium">Registered</th>
                  <th scope="col" className="px-4 py-3 font-medium">Approved / Required</th>
                  <th scope="col" className="px-4 py-3 font-medium">Pending</th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myActivities.map((activity) => {
                  const apps = myApplications.filter((app) => app.activityId === activity.id);
                  return (
                    <tr key={activity.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-xs text-muted">{activity.location}</p>
                      </td>
                      <td className="px-4 py-3">{formatDate(activity.date)}</td>
                      <td className="px-4 py-3">{apps.length}</td>
                      <td className="px-4 py-3">
                        {apps.filter((a) => a.status === "Approved").length} / {activity.volunteersRequired}
                      </td>
                      <td className="px-4 py-3">{apps.filter((a) => a.status === "Pending").length}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/activities/${activity.id}`} className={buttonClass("secondary", "sm")}>
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="create-activity" aria-labelledby="create-activity-heading" className="scroll-mt-6">
        <Card className="p-6">
          <h2 id="create-activity-heading" className="mb-4 text-xl font-semibold">
            Create a new activity
          </h2>
          <CreateActivityForm onCreated={() => setMessage(null)} />
        </Card>
      </section>
    </div>
  );
}
