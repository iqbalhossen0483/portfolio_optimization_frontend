"use client";

import { useMemo, useState } from "react";
import { useListAssetsQuery } from "@/store/api";
import { Select } from "@/components/ui/Select";
import { SearchBar } from "@/components/admin/SearchBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Typography } from "@/components/ui/Typography";

export function AssetsBrowser() {
  const [sector, setSector] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListAssetsQuery(
    sector ? { sector } : undefined,
  );

  const sectors = useMemo(
    () =>
      data
        ? [...new Set(data.assets.map((a) => a.sector))].sort()
        : [],
    [data],
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    if (!q) return data.assets;
    return data.assets.filter(
      (a) =>
        a.isin.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by ISIN or name…"
          />
        </div>
        <div className="w-48">
          <Select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            options={[
              { value: "", label: "All Sectors" },
              ...sectors.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-raised">
            <tr>
              {["ISIN", "Name", "Sector"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3"><Skeleton className="h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4" /></td>
                  </tr>
                ))
              : filtered.map((a) => (
                  <tr key={a.isin} className="border-t border-border hover:bg-surface-raised/50">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs">{a.isin}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{a.name}</td>
                    <td className="px-4 py-3 text-sm text-muted">{a.sector}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <Typography variant="caption">
        {filtered.length} assets shown
      </Typography>
    </div>
  );
}
