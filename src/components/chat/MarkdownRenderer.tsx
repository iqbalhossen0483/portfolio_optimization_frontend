import { cn } from "@/lib/cn";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1
      className="text-xl font-semibold text-foreground mt-5 mb-2 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-lg font-semibold text-foreground mt-4 mb-2 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-base font-semibold text-foreground mt-3 mb-1.5 first:mt-0"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="text-sm font-semibold text-foreground mt-3 mb-1 first:mt-0"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="text-foreground leading-relaxed mb-3 last:mb-0" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary-hover"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-5 mb-3 last:mb-0 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-5 mb-3 last:mb-0 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-foreground leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-2 border-border-strong pl-3 my-3 text-muted italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-4" />,
  code: ({ className, children, ...props }) => {
    const isBlock = className && className.startsWith("language-");
    if (isBlock) {
      return (
        <code className={cn("font-mono text-xs", className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="font-mono text-[0.85em] bg-surface-raised border border-border px-1.5 py-0.5 rounded"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="bg-surface-raised border border-border rounded-lg p-3 overflow-x-auto text-xs my-3"
      {...props}
    >
      {children}
    </pre>
  ),
  // The wrapper div + overflow-x-auto is what prevents long tables from
  // overflowing the viewport on mobile. Combined with `min-w-0` on the
  // markdown's parent flex item, the table now scrolls horizontally inside
  // the message instead of pushing the page wider.
  table: ({ children, ...props }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead
      className="bg-surface-raised text-xs uppercase tracking-wide text-muted"
      {...props}
    >
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr
      className="border-b border-border last:border-b-0 hover:bg-surface-raised/40 transition-colors"
      {...props}
    >
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="text-left font-medium px-3 py-2 whitespace-nowrap"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-3 py-2 text-foreground align-top" {...props}>
      {children}
    </td>
  ),
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("text-sm min-w-0", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
