import { cn } from "@/lib/cn";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "caption"
  | "mono"
  | "label";

interface TypographyProps {
  variant: TypographyVariant;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const variantMap: Record<
  TypographyVariant,
  { tag: React.ElementType; cls: string }
> = {
  h1: { tag: "h1", cls: "text-2xl font-bold text-foreground" },
  h2: { tag: "h2", cls: "text-xl font-semibold text-foreground" },
  h3: { tag: "h3", cls: "text-lg font-medium text-foreground" },
  h4: { tag: "h4", cls: "text-base font-medium text-foreground" },
  body: { tag: "p", cls: "text-sm text-muted" },
  caption: { tag: "span", cls: "text-xs text-subtle" },
  mono: {
    tag: "code",
    cls: "font-mono text-xs bg-surface-raised px-1 rounded",
  },
  label: {
    tag: "label",
    cls: "text-xs font-medium text-muted uppercase tracking-wide",
  },
};

export function Typography({
  variant,
  as,
  className,
  children,
}: TypographyProps) {
  const { tag: DefaultTag, cls } = variantMap[variant];
  const Tag = as ?? DefaultTag;
  return <Tag className={cn(cls, className)}>{children}</Tag>;
}
