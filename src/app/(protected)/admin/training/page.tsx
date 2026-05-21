"use client";

import { JobsTable } from "@/components/admin/JobsTable";
import { StartTrainingForm } from "@/components/admin/StartTrainingForm";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function TrainingPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h2">Training</Typography>
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
      </div>

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
  );
}
