import { cn } from "@/lib/cn";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl bg-surface-raised border border-border shadow-xl p-8",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
