"use client";

import { cn } from "@/lib/cn";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  accept?: string;
  onChange: (file: File | null) => void;
  label?: string;
  error?: string;
}

export function FileUpload({
  accept,
  onChange,
  label,
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    setFileName(file?.name ?? null);
    onChange(file);
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
          "border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors",
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
          const file = e.dataTransfer.files[0] ?? null;
          handleFile(file);
        }}
      >
        <Upload className="w-6 h-6 text-muted mx-auto mb-2" />
        {fileName ? (
          <p className="text-sm text-foreground">{fileName}</p>
        ) : (
          <p className="text-sm text-muted">
            Drop file here or <span className="text-primary">browse</span>
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
