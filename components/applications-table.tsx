"use client";

import Link from "next/link";
import type { Activity, Application, ApplicationStatus, User } from "@/lib/types";
import { Button, StatusBadge } from "./ui";

interface ApplicationsTableProps {
  applications: Application[];
  users: User[];
  activities?: Activity[];
  onUpdate: (applicationId: string, status: ApplicationStatus) => void;
  emptyMessage: string;
}

export function ApplicationsTable({ applications, users, activities, onUpdate, emptyMessage }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Volunteer</th>
            {activities && <th scope="col" className="px-4 py-3 font-medium">Activity</th>}
            <th scope="col" className="px-4 py-3 font-medium">Contact</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {applications.map((application) => {
            const volunteer = users.find((u) => u.id === application.volunteerId);
            const activity = activities?.find((a) => a.id === application.activityId);
            return (
              <tr key={application.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{volunteer?.fullName ?? "Unknown volunteer"}</p>
                  {volunteer?.location && <p className="text-xs text-muted">{volunteer.location}</p>}
                </td>
                {activities && (
                  <td className="px-4 py-3">
                    {activity ? (
                      <Link href={`/activities/${activity.id}`} className="text-primary hover:underline">
                        {activity.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                )}
                <td className="px-4 py-3">
                  <p>{volunteer?.email}</p>
                  <p className="text-xs text-muted">{volunteer?.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={application.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {application.status !== "Approved" && (
                      <Button size="sm" onClick={() => onUpdate(application.id, "Approved")}>
                        Approve
                      </Button>
                    )}
                    {application.status !== "Rejected" && (
                      <Button size="sm" variant="danger" onClick={() => onUpdate(application.id, "Rejected")}>
                        Reject
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
