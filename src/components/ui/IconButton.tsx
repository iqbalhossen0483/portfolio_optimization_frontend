import { cn } from "@/lib/cn";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  "aria-label": string;
  size?: "sm" | "md";
  variant?: "ghost" | "danger";
}

const variantCls = {
  ghost: "hover:bg-surface-raised text-muted hover:text-foreground",
  danger: "hover:bg-destructive/10 text-muted hover:text-destructive",
};

const sizeCls = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
};

export function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantCls[variant],
        sizeCls[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
