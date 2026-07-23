"use client";

import * as React from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  className?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
}

export function FileUpload({
  accept = "*",
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  onFilesChange,
  onUpload,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = React.useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles = fileArray.filter((f) => f.size <= maxSize).slice(0, maxFiles);

      const uploaded: UploadedFile[] = validFiles.map((file) => ({
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: "pending" as const,
      }));

      setFiles((prev) => {
        const combined = [...prev, ...uploaded].slice(0, maxFiles);
        onFilesChange?.(combined.map((f) => f.file));
        return combined;
      });
    },
    [maxSize, maxFiles, onFilesChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesChange?.(updated.map((f) => f.file));
      return updated;
    });
  };

  const simulateUpload = async () => {
    if (!onUpload) return;

    setFiles((prev) =>
      prev.map((f) => (f.status === "pending" ? { ...f, status: "uploading" as const } : f))
    );

    const pendingFiles = files.filter((f) => f.status === "pending").map((f) => f.file);

    try {
      await onUpload(pendingFiles);
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading" ? { ...f, progress: 100, status: "done" as const } : f
        )
      );
    } catch {
      setFiles((prev) =>
        prev.map((f) => (f.status === "uploading" ? { ...f, status: "error" as const } : f))
      );
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-electric-blue bg-electric-blue/5"
            : "border-light-gray hover:border-electric-blue/40 hover:bg-light-gray/30"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-gray">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium text-navy">
          Drop files here or <span className="text-electric-blue">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {formatSize(maxSize)} per file, up to {maxFiles} files
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploaded, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-light-gray bg-white p-3"
            >
              {uploaded.preview ? (
                <img
                  src={uploaded.preview}
                  alt={uploaded.file.name}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-light-gray">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-navy">{uploaded.file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(uploaded.file.size)}</p>
                {uploaded.status === "uploading" && (
                  <Progress value={uploaded.progress} className="mt-1 h-1.5" />
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="rounded-md p-1 text-muted-foreground hover:bg-light-gray hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {onUpload && files.some((f) => f.status === "pending") && (
            <Button onClick={simulateUpload} className="w-full" size="sm">
              Upload {files.filter((f) => f.status === "pending").length} file(s)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
