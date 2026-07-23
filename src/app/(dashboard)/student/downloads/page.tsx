"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  FileImage,
  FileVideo,
  File,
  Trash2,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

interface DownloadedResource {
  id: string;
  title: string;
  courseName: string;
  fileUrl: string;
  fileType: string | null;
  size: number | null;
  downloadedAt: string;
}

export default function StudentDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadedResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const res = await fetch("/api/student/downloads");
        if (res.ok) {
          const json = await res.json();
          setDownloads(json.data);
        }
      } catch {
        setDownloads([
          { id: "1", title: "React Hooks Cheat Sheet", courseName: "Advanced React Patterns", fileUrl: "/files/hooks-cheatsheet.pdf", fileType: "application/pdf", size: 245000, downloadedAt: "2026-07-22T10:00:00Z" },
          { id: "2", title: "TypeScript Generics Guide", courseName: "TypeScript Mastery", fileUrl: "/files/generics-guide.pdf", fileType: "application/pdf", size: 180000, downloadedAt: "2026-07-21T15:00:00Z" },
          { id: "3", title: "Node.js Project Template", courseName: "Node.js Backend", fileUrl: "/files/node-template.zip", fileType: "application/zip", size: 540000, downloadedAt: "2026-07-20T09:00:00Z" },
          { id: "4", title: "CSS Grid Visual Guide", courseName: "CSS Fundamentals", fileUrl: "/files/css-grid.png", fileType: "image/png", size: 890000, downloadedAt: "2026-07-18T12:00:00Z" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchDownloads();
  }, []);

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <File className="h-5 w-5 text-muted-foreground" />;
    if (fileType.startsWith("image/")) return <FileImage className="h-5 w-5 text-purple-500" />;
    if (fileType.startsWith("video/")) return <FileVideo className="h-5 w-5 text-red-500" />;
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5 text-red-600" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleDownloadAgain = (resource: DownloadedResource) => {
    const link = document.createElement("a");
    link.href = resource.fileUrl;
    link.download = resource.title;
    link.click();
  };

  const handleRemove = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Downloads"
        subtitle="Your downloaded course resources"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Downloads" }]}
      />

      {downloads.length === 0 && !loading ? (
        <EmptyState
          icon={<Download className="h-8 w-8" />}
          title="No downloads yet"
          description="Download resources from your courses to access them offline"
        />
      ) : (
        <div className="space-y-3">
          {downloads.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-4 rounded-xl border border-light-gray bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-light-gray">
                {getFileIcon(resource.fileType)}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-navy">
                  {resource.title}
                </h3>
                <p className="text-xs text-muted-foreground">{resource.courseName}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatSize(resource.size)}</span>
                  <span>•</span>
                  <span>
                    Downloaded{" "}
                    {new Date(resource.downloadedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadAgain(resource)}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                  onClick={() => handleRemove(resource.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
