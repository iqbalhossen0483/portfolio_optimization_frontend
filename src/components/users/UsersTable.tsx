"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useListUsersQuery } from "@/store/api";
import { SearchBar } from "@/components/admin/SearchBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserRow } from "./UserRow";

export function UsersTable() {
  const { data: session } = useSession();
  const { data, isLoading } = useListUsersQuery();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data?.users) return [];
    const q = search.toLowerCase();
    if (!q) return data.users;
    return data.users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by email or username…"
      />
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-raised">
            <tr>
              {["ID", "Email", "Username", "Role", "Active", "Created", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  {Array.from({ length: 7 }).map((_, ci) => (
                    <td key={ci} className="px-4 py-3">
                      <Skeleton className="h-4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              filtered.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUserId={session?.user?.id ?? ""}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
