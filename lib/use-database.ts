"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "./storage";

export function useDatabase() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useSession() {
  const db = useDatabase();
  const user = db.users.find((u) => u.id === db.sessionUserId) ?? null;
  return { ready: db.ready, user };
}
