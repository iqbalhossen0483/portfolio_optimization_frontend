"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AssetTable } from "@/components/admin/AssetTable";

export default function AssetsPage() {
  return (
    <>
      <AdminPageHeader
        title="Assets"
        description="Browse all ingested equities and their market-data row counts"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
          <AssetTable />
        </div>
      </div>
    </>
  );
}
