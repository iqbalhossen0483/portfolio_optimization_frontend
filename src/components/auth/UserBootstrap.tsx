"use client";

import { useGetMeQuery } from "@/store/api";

/**
 * Fires `GET /auth/me` once mounted. The query's `onQueryStarted` hook in
 * `store/api.ts` pushes the result into the `user` slice, so any component
 * can read the current user via `useAppSelector((s) => s.user.user)`.
 *
 * Mounted in the protected layout — server components can't call hooks
 * directly, so this client component does it on their behalf.
 */
export function UserBootstrap() {
  useGetMeQuery();
  return null;
}
