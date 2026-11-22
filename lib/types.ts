export type Role = "volunteer" | "coordinator";

export type ApplicationStatus = "Pending" | "Approved" | "Rejected";

export interface User {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  location?: string;
  organization?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  coordinatorId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  volunteersRequired: number;
  createdAt: string;
}

export interface Application {
  id: string;
  activityId: string;
  volunteerId: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Database {
  ready: boolean;
  users: User[];
  activities: Activity[];
  applications: Application[];
  sessionUserId: string | null;
}

export type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string };
