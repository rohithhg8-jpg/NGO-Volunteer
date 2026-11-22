"use client";

import Link from "next/link";
import { useState } from "react";
import { joinActivity } from "@/lib/actions";
import { formatDate, todayIso } from "@/lib/format";
import type { User } from "@/lib/types";
import { useDatabase } from "@/lib/use-database";
import { ActivityCard } from "./activity-card";
import { Alert, PageHeader, StatCard, StatusBadge } from "./ui";

export function VolunteerDashboard({ user, welcome }: { user: User; welcome: boolean }) {
  const db = useDatabase();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    welcome ? { type: "success", text: `Welcome, ${user.fullName}! Your volunteer account is ready.` } : null,
  );

  const myApplications = db.applications.filter((app) => app.volunteerId === user.id);
  const upcoming = db.activities
    .filter((activity) => activity.date >= todayIso())
    .sort((a, b) => a.date.localeCompare(b.date));

  function handleJoin(activityId: string, title: string) {
    const result = joinActivity(activityId);
    setMessage(
      result.ok
        ? { type: "success", text: `You applied for "${title}". The coordinator will review your request.` }
        : { type: "error", text: result.error },
    );
  }

  const count = (status: string) => myApplications.filter((app) => app.status === status).length;

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Volunteer Dashboard" description={`Hello ${user.fullName} · ${user.location}`} />

      {message && <Alert type={message.type}>{message.text}</Alert>}

      <section aria-label="Summary" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Activities joined" value={myApplications.length} />
        <StatCard label="Pending" value={count("Pending")} />
        <StatCard label="Approved" value={count("Approved")} />
        <StatCard label="Rejected" value={count("Rejected")} />
      </section>

      <section aria-labelledby="my-activities">
        <h2 id="my-activities" className="mb-4 text-xl font-semibold">
          My joined activities
        </h2>
        {myApplications.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            You have not joined any activities yet. Choose one from the list below.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Activity</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium">Location</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myApplications.map((application) => {
                  const activity = db.activities.find((a) => a.id === application.activityId);
                  if (!activity) return null;
                  return (
                    <tr key={application.id}>
                      <td className="px-4 py-3">
                        <Link href={`/activities/${activity.id}`} className="font-medium text-primary hover:underline">
                          {activity.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{formatDate(activity.date)}</td>
                      <td className="px-4 py-3">{activity.location}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={application.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="available-activities">
        <h2 id="available-activities" className="mb-4 text-xl font-semibold">
          Available activities
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted">No upcoming activities right now. Please check back later.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                organization={db.users.find((u) => u.id === activity.coordinatorId)?.organization}
                approvedCount={
                  db.applications.filter((app) => app.activityId === activity.id && app.status === "Approved").length
                }
                myStatus={myApplications.find((app) => app.activityId === activity.id)?.status}
                onJoin={() => handleJoin(activity.id, activity.title)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
