"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JobsTable } from "@/components/admin/JobsTable";
import { StartTrainingForm } from "@/components/admin/StartTrainingForm";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function TrainingPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <AdminPageHeader
        title="Training"
        description="Manage MASAC training jobs"
        actions={
          <Button
            variant={showForm ? "secondary" : "primary"}
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? (
              "Cancel"
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Start Training
              </>
            )}
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 space-y-6">
          {showForm && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <Typography variant="h3" className="mb-4">
                New Training Run
              </Typography>
              <StartTrainingForm />
            </div>
          )}
          <JobsTable />
        </div>
      </div>
    </>
  );
}
