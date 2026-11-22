import { commit, createId, getSnapshot } from "./storage";
import type { Activity, ApplicationStatus, Result, Role, User } from "./types";

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export interface RegisterInput {
  role: Role;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  location?: string;
  organization?: string;
}

export async function registerUser(input: RegisterInput): Promise<Result<User>> {
  const db = getSnapshot();
  const email = normalizeEmail(input.email);

  if (db.users.some((user) => user.email === email)) {
    return { ok: false, error: "An account with this email already exists. Please log in instead." };
  }

  const user: User = {
    id: createId("user"),
    role: input.role,
    fullName: input.fullName.trim(),
    email,
    phone: input.phone.trim(),
    passwordHash: await hashPassword(input.password),
    location: input.role === "volunteer" ? input.location?.trim() : undefined,
    organization: input.role === "coordinator" ? input.organization?.trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  commit({ users: [...db.users, user], sessionUserId: user.id });
  return { ok: true, data: user };
}

export async function login(email: string, password: string, role: Role): Promise<Result<User>> {
  const db = getSnapshot();
  const user = db.users.find((u) => u.email === normalizeEmail(email));
  const passwordHash = await hashPassword(password);

  if (!user || user.passwordHash !== passwordHash) {
    return { ok: false, error: "Incorrect email or password." };
  }
  if (user.role !== role) {
    return {
      ok: false,
      error: `This account is registered as a ${user.role}. Please select "${user.role === "volunteer" ? "Volunteer" : "Coordinator"}" to log in.`,
    };
  }

  commit({ sessionUserId: user.id });
  return { ok: true, data: user };
}

export function logout() {
  commit({ sessionUserId: null });
}

function currentUser(role: Role): User | null {
  const db = getSnapshot();
  const user = db.users.find((u) => u.id === db.sessionUserId);
  return user && user.role === role ? user : null;
}

export interface ActivityInput {
  title: string;
  description: string;
  date: string;
  location: string;
  volunteersRequired: number;
}

export function createActivity(input: ActivityInput): Result<Activity> {
  const coordinator = currentUser("coordinator");
  if (!coordinator) return { ok: false, error: "Only logged-in coordinators can create activities." };

  const db = getSnapshot();
  const activity: Activity = {
    id: createId("activity"),
    coordinatorId: coordinator.id,
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    location: input.location.trim(),
    volunteersRequired: input.volunteersRequired,
    createdAt: new Date().toISOString(),
  };

  commit({ activities: [activity, ...db.activities] });
  return { ok: true, data: activity };
}

export function joinActivity(activityId: string): Result {
  const volunteer = currentUser("volunteer");
  if (!volunteer) return { ok: false, error: "Please log in as a volunteer to join activities." };

  const db = getSnapshot();
  const activity = db.activities.find((a) => a.id === activityId);
  if (!activity) return { ok: false, error: "This activity no longer exists." };

  const alreadyApplied = db.applications.some(
    (app) => app.activityId === activityId && app.volunteerId === volunteer.id,
  );
  if (alreadyApplied) return { ok: false, error: "You have already applied for this activity." };

  const approvedCount = db.applications.filter(
    (app) => app.activityId === activityId && app.status === "Approved",
  ).length;
  if (approvedCount >= activity.volunteersRequired) {
    return { ok: false, error: "This activity already has all the volunteers it needs." };
  }

  commit({
    applications: [
      ...db.applications,
      {
        id: createId("application"),
        activityId,
        volunteerId: volunteer.id,
        status: "Pending",
        appliedAt: new Date().toISOString(),
      },
    ],
  });
  return { ok: true, data: undefined };
}

export function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Result {
  const coordinator = currentUser("coordinator");
  if (!coordinator) return { ok: false, error: "Only coordinators can review applications." };

  const db = getSnapshot();
  const application = db.applications.find((app) => app.id === applicationId);
  const activity = db.activities.find((a) => a.id === application?.activityId);

  if (!application || !activity) return { ok: false, error: "Application not found." };
  if (activity.coordinatorId !== coordinator.id) {
    return { ok: false, error: "You can only review applications for your own activities." };
  }

  commit({
    applications: db.applications.map((app) => (app.id === applicationId ? { ...app, status } : app)),
  });
  return { ok: true, data: undefined };
}
