import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Activity, ApplicationStatus } from "@/lib/types";
import { buttonClass, Card, StatusBadge } from "./ui";

interface ActivityCardProps {
  activity: Activity;
  organization?: string;
  approvedCount: number;
  myStatus?: ApplicationStatus;
  onJoin?: () => void;
}

export function ActivityCard({ activity, organization, approvedCount, myStatus, onJoin }: ActivityCardProps) {
  const isFull = approvedCount >= activity.volunteersRequired;

  return (
    <Card className="flex h-full flex-col gap-3">
      <div>
        <h3 className="font-semibold leading-snug">{activity.title}</h3>
        {organization && <p className="text-sm text-muted">{organization}</p>}
      </div>
      <dl className="grid gap-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-muted">Date</dt>
          <dd>{formatDate(activity.date)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-muted">Location</dt>
          <dd>{activity.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-muted">Volunteers</dt>
          <dd>
            {approvedCount} / {activity.volunteersRequired} approved
          </dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        <Link href={`/activities/${activity.id}`} className={buttonClass("secondary", "sm")}>
          View Details
        </Link>
        {myStatus ? (
          <span className="flex items-center gap-2 text-sm text-muted">
            Applied <StatusBadge status={myStatus} />
          </span>
        ) : onJoin && !isFull ? (
          <button type="button" onClick={onJoin} className={buttonClass("primary", "sm")}>
            Join Activity
          </button>
        ) : onJoin && isFull ? (
          <span className="text-sm text-muted">Fully staffed</span>
        ) : null}
      </div>
    </Card>
  );
}
