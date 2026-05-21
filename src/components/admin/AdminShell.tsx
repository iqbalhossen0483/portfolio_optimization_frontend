"use client";

import { Sheet } from "@/components/ui/Sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { AdminSidebar } from "./AdminSidebar";

/**
 * Client wrapper that places the AdminSidebar (desktop) and a slide-out
 * Sheet (mobile) around the page content. Used inside the server `admin/layout`.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>
      <Sheet open={sidebarOpen} onClose={() => dispatch(setSidebarOpen(false))}>
        <AdminSidebar />
      </Sheet>
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
