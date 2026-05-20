"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useListAdminAssetsQuery } from "@/store/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { SearchBar } from "./SearchBar";
import { PaginationControls } from "./PaginationControls";
import type { AssetListItem } from "@/types/api";

const col = createColumnHelper<AssetListItem>();

const columns = [
  col.accessor("isin", {
    header: "ISIN",
    cell: (i) => (
      <code className="font-mono text-xs">{i.getValue()}</code>
    ),
  }),
  col.accessor("name", {
    header: "Name",
    cell: (i) => <span className="text-sm text-foreground">{i.getValue()}</span>,
  }),
  col.accessor("sector", {
    header: "Sector",
    cell: (i) => <Chip label={i.getValue()} />,
  }),
  col.accessor("market_data_count", {
    header: "Data Rows",
    cell: (i) => (
      <span className="text-sm text-muted">
        {i.getValue().toLocaleString()}
      </span>
    ),
  }),
  col.accessor("created_at", {
    header: "Added",
    cell: (i) => (
      <span className="text-sm text-muted">
        {new Date(i.getValue()).toLocaleDateString()}
      </span>
    ),
  }),
];

export function AssetTable() {
  const [search, setSearch] = useState("");
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const debouncedQ = useDebounce(search, 300);
  const currentCursor = cursorStack.at(-1);

  const { data, isFetching } = useListAdminAssetsQuery({
    q: debouncedQ || undefined,
    limit: 20,
    cursor: currentCursor,
  });

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCursorStack([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by name, ISIN, or sector…"
      />

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-raised">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isFetching && !data ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  {columns.map((_, ci) => (
                    <td key={ci} className="px-4 py-3">
                      <Skeleton className="h-4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border hover:bg-surface-raised/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        shown={data?.items.length ?? 0}
        total={data?.items.length ?? 0}
        hasPrev={cursorStack.length > 0}
        hasNext={data?.has_more ?? false}
        onPrev={() => setCursorStack((s) => s.slice(0, -1))}
        onNext={() => {
          if (data?.next_cursor) {
            setCursorStack((s) => [...s, data.next_cursor!]);
          }
        }}
      />
    </div>
  );
}
