import { buildSeedData } from "./seed";
import type { Activity, Application, Database, User } from "./types";

/*
 * All persistence goes through this module. To move to a real database later,
 * replace the read/write functions here (or the actions in lib/actions.ts)
 * with API calls; the UI only depends on the exported functions.
 */

const KEYS = {
  users: "volunteerhub:users",
  activities: "volunteerhub:activities",
  applications: "volunteerhub:applications",
  session: "volunteerhub:session",
  seeded: "volunteerhub:seeded",
} as const;

const SERVER_SNAPSHOT: Database = {
  ready: false,
  users: [],
  activities: [],
  applications: [],
  sessionUserId: null,
};

let cache: Database | null = null;
const listeners = new Set<() => void>();

function readArray<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function seedIfNeeded() {
  if (window.localStorage.getItem(KEYS.seeded)) return;
  const seed = buildSeedData();
  window.localStorage.setItem(KEYS.users, JSON.stringify(seed.users));
  window.localStorage.setItem(KEYS.activities, JSON.stringify(seed.activities));
  window.localStorage.setItem(KEYS.applications, JSON.stringify(seed.applications));
  window.localStorage.setItem(KEYS.seeded, "true");
}

function loadFromStorage(): Database {
  seedIfNeeded();
  return {
    ready: true,
    users: readArray<User>(KEYS.users),
    activities: readArray<Activity>(KEYS.activities),
    applications: readArray<Application>(KEYS.applications),
    sessionUserId: window.localStorage.getItem(KEYS.session),
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key && !event.key.startsWith("volunteerhub:")) return;
  cache = loadFromStorage();
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", handleStorageEvent);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}

export function getSnapshot(): Database {
  if (!cache) cache = loadFromStorage();
  return cache;
}

export function getServerSnapshot(): Database {
  return SERVER_SNAPSHOT;
}

export function commit(update: Partial<Omit<Database, "ready">>) {
  const current = getSnapshot();
  const next: Database = { ...current, ...update };

  if (update.users) window.localStorage.setItem(KEYS.users, JSON.stringify(next.users));
  if (update.activities) window.localStorage.setItem(KEYS.activities, JSON.stringify(next.activities));
  if (update.applications) window.localStorage.setItem(KEYS.applications, JSON.stringify(next.applications));
  if ("sessionUserId" in update) {
    if (next.sessionUserId) window.localStorage.setItem(KEYS.session, next.sessionUserId);
    else window.localStorage.removeItem(KEYS.session);
  }

  cache = next;
  emit();
}

export function createId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${random}`;
}
