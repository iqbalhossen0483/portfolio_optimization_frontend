"use client";

import { cn } from "@/lib/cn";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  files?: File[];
  label?: string;
  error?: string;
}

export function FileUpload({
  accept,
  multiple = false,
  onChange,
  files,
  label,
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [internal, setInternal] = useState<File[]>([]);
  const selected = files ?? internal;

  const update = (next: File[]) => {
    if (files === undefined) setInternal(next);
    onChange(next);
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const arr = Array.from(incoming);
    update(multiple ? [...selected, ...arr] : arr.slice(0, 1));
  };

  const removeAt = (idx: number) => {
    update(selected.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
      )}
      <div
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors cursor-pointer",
          "hover:border-primary",
          dragOver && "border-primary bg-primary/5",
          error && "border-destructive",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="w-6 h-6 text-muted mx-auto mb-2" />
        <p className="text-sm text-muted">
          {multiple ? "Drop files here or " : "Drop file here or "}
          <span className="text-primary">browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {selected.length > 0 && (
        <ul className="flex flex-col gap-1 mt-1">
          {selected.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-surface-raised border border-border text-sm"
            >
              <span className="truncate text-foreground">{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(idx);
                }}
                className="text-muted hover:text-destructive transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
