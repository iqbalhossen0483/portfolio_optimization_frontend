import { cn } from "@/lib/cn";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

const sideClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
  left: "right-full top-1/2 -translate-y-1/2 mr-1",
  right: "left-full top-1/2 -translate-y-1/2 ml-1",
};

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        className={cn(
          "absolute z-50 px-2 py-1 rounded text-xs bg-surface-raised border border-border text-foreground whitespace-nowrap pointer-events-none",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          sideClasses[side],
        )}
      >
        {content}
      </span>
    </span>
  );
}
