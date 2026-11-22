"use client";

import Link from "next/link";
import { useState } from "react";
import { joinActivity, updateApplicationStatus } from "@/lib/actions";
import { formatDate, todayIso } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/types";
import { useDatabase, useSession } from "@/lib/use-database";
import { ApplicationsTable } from "./applications-table";
import { Alert, Button, buttonClass, Card, LoadingState, StatCard, StatusBadge } from "./ui";

export function ActivityDetails({ id }: { id: string }) {
  const db = useDatabase();
  const { user } = useSession();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!db.ready) return <LoadingState />;

  const activity = db.activities.find((a) => a.id === id);
  if (!activity) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <Alert type="error">This activity could not be found.</Alert>
        <Link href="/" className={buttonClass()}>
          Back to Home
        </Link>
      </div>
    );
  }

  const coordinator = db.users.find((u) => u.id === activity.coordinatorId);
  const applications = db.applications.filter((app) => app.activityId === activity.id);
  const approvedCount = applications.filter((app) => app.status === "Approved").length;
  const isOwner = user?.role === "coordinator" && user.id === activity.coordinatorId;
  const myApplication = user?.role === "volunteer" ? applications.find((a) => a.volunteerId === user.id) : undefined;
  const isPast = activity.date < todayIso();
  const isFull = approvedCount >= activity.volunteersRequired;
  const backHref = user ? `/${user.role}/dashboard` : "/";

  function handleJoin() {
    const result = joinActivity(id);
    setMessage(
      result.ok
        ? { type: "success", text: "Application submitted! Your status is Pending until the coordinator reviews it." }
        : { type: "error", text: result.error },
    );
  }

  function handleUpdate(applicationId: string, status: ApplicationStatus) {
    const result = updateApplicationStatus(applicationId, status);
    setMessage(
      result.ok
        ? { type: "success", text: `Application ${status.toLowerCase()} successfully.` }
        : { type: "error", text: result.error },
    );
  }

  function renderVolunteerAction() {
    if (!user) {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">Log in as a volunteer to join this activity.</p>
          <Link href="/login" className={buttonClass()}>
            Login to Join
          </Link>
        </div>
      );
    }
    if (user.role !== "volunteer") return null;
    if (myApplication) {
      return (
        <p className="flex items-center gap-2 text-sm">
          Your application status: <StatusBadge status={myApplication.status} />
        </p>
      );
    }
    if (isPast) return <p className="text-sm text-muted">This activity has already taken place.</p>;
    if (isFull) return <p className="text-sm text-muted">This activity already has all the volunteers it needs.</p>;
    return <Button onClick={handleJoin}>Join Activity</Button>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href={backHref} className="text-sm font-medium text-primary hover:underline">
        {"← Back"}
      </Link>

      {message && <Alert type={message.type}>{message.text}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col gap-4 p-6 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-bold text-balance md:text-3xl">{activity.title}</h1>
            {coordinator && (
              <p className="mt-1 text-muted">
                Organised by {coordinator.organization} · Coordinator: {coordinator.fullName}
              </p>
            )}
          </div>
          <p className="leading-relaxed text-pretty whitespace-pre-line">{activity.description}</p>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-muted">Date</dt>
              <dd className="font-medium">{formatDate(activity.date)}</dd>
            </div>
            <div>
              <dt className="text-muted">Location</dt>
              <dd className="font-medium">{activity.location}</dd>
            </div>
            <div>
              <dt className="text-muted">Volunteers required</dt>
              <dd className="font-medium">{activity.volunteersRequired}</dd>
            </div>
            <div>
              <dt className="text-muted">Approved so far</dt>
              <dd className="font-medium">{approvedCount}</dd>
            </div>
          </dl>
          {renderVolunteerAction()}
        </Card>
      </div>

      {isOwner && (
        <section aria-labelledby="applicants" className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Total registered" value={applications.length} />
            <StatCard label="Pending" value={applications.filter((a) => a.status === "Pending").length} />
            <StatCard label="Approved" value={approvedCount} />
            <StatCard label="Rejected" value={applications.filter((a) => a.status === "Rejected").length} />
          </div>
          <h2 id="applicants" className="text-xl font-semibold">
            Volunteer applications
          </h2>
          <ApplicationsTable
            applications={applications}
            users={db.users}
            onUpdate={handleUpdate}
            emptyMessage="No volunteers have applied for this activity yet."
          />
        </section>
      )}
    </div>
  );
}
