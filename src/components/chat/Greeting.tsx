"use client";

import { useAppSelector } from "@/store/hooks";
import { Sparkles } from "lucide-react";

function timeOfDay(hour: number) {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function firstName(name?: string | null) {
  if (!name) return null;
  return name.trim().split(/\s+/)[0];
}

export function Greeting() {
  const user = useAppSelector((s) => s.user.user);
  const hour = new Date().getHours();
  const greeting = `Good ${timeOfDay(hour)}`;
  const name = firstName(user?.name);

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary">
        <Sparkles className="w-5 h-5" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
        {name ? `${greeting}, ${name}` : greeting}
      </h1>
      <p className="text-sm text-muted max-w-md">
        Your multi-agent portfolio advisor for ESG-aware allocation, market
        intelligence, and ESG research.
      </p>
    </div>
  );
}
