import { cn } from "@/lib/cn";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-100 rounded-2xl px-9 py-10",
          "bg-surface border border-border-strong/20",
          "animate-auth-rise",
          className,
        )}
      >
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-14 h-14 mb-4">
            <div className="absolute inset-0 rounded-2xl rotate-45 bg-primary/5 border border-primary/25 shadow-lg shadow-primary/20" />
            <div className="absolute inset-1.25 rounded-xl rotate-45 bg-primary/15 border border-primary/40" />
            <div className="absolute inset-2.5 rounded-lg rotate-45 bg-primary/85 shadow-md shadow-primary/40" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.32em] text-muted/60 font-semibold">
            MADRL Portfolio
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
