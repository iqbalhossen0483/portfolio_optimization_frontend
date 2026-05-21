interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl bg-surface-raised text-foreground text-sm px-4 py-2.5 whitespace-pre-wrap break-words border border-border">
        {content}
      </div>
    </div>
  );
}
