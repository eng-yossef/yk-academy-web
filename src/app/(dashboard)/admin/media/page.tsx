"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  FolderOpen,
  Grid,
  List,
  Eye,
  Copy,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
  folder: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [currentFolder, setCurrentFolder] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = React.useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (currentFolder) params.set("folder", currentFolder);
    if (searchQuery) params.set("search", searchQuery);
    fetch(`/api/admin/media?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMedia(data.data);
      })
      .catch(() => { toast({ title: "Error", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [currentFolder, searchQuery, toast, refreshKey]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", currentFolder || "");
        await fetch("/api/admin/media/upload", { method: "POST", body: formData });
      }
      toast({ title: "Uploaded", description: `${files.length} file(s) uploaded` });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/media/${deleteId}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      if (selectedItem?.id === deleteId) setSelectedItem(null);
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied", description: "URL copied to clipboard" });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-6 w-6" />;
    if (mimeType.startsWith("video/")) return <Film className="h-6 w-6" />;
    if (mimeType.startsWith("audio/")) return <Music className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const folders = React.useMemo(() => {
    const f = new Set(media.filter((m) => m.folder).map((m) => m.folder!));
    return Array.from(f);
  }, [media]);

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Media Library"
          subtitle={`${media.length} files`}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Media" }]}
          actions={
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          }
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-electric-blue text-white" : ""}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-electric-blue text-white" : ""}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {currentFolder && (
          <div className="mb-4 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCurrentFolder(null)}>
              <FolderOpen className="mr-1 h-4 w-4" /> All Files
            </Button>
            <span className="text-muted-foreground">/</span>
            <Badge variant="secondary">{currentFolder}</Badge>
          </div>
        )}

        {loading ? (
          <div className={cn(viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "space-y-2")}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={cn("animate-pulse bg-light-gray", viewMode === "grid" ? "aspect-square rounded-xl" : "h-16 rounded-lg")} />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12" />
              <p className="mt-3 text-sm">No files yet. Upload to get started.</p>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {media.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  "group cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md",
                  selectedItem?.id === item.id ? "border-electric-blue ring-2 ring-electric-blue/20" : "border-light-gray"
                )}
              >
                {item.mimeType.startsWith("image/") ? (
                  <div className="aspect-square bg-light-gray">
                    <img src={item.url} alt={item.alt || item.originalName} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-light-gray text-muted-foreground">
                    {getFileIcon(item.mimeType)}
                  </div>
                )}
                <div className="p-3">
                  <p className="truncate text-xs font-medium text-navy">{item.originalName}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(item.size)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-light-gray bg-white shadow-sm">
            {media.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  "flex items-center gap-3 border-b border-light-gray px-4 py-3 last:border-0 hover:bg-light-gray/50 cursor-pointer",
                  selectedItem?.id === item.id && "bg-electric-blue/5"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-light-gray text-muted-foreground">
                  {getFileIcon(item.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-navy">{item.originalName}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(item.size)}</p>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
              </motion.div>
            ))}
          </div>
        )}

        {selectedItem && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-0 left-72 right-0 border-t border-light-gray bg-white p-4 shadow-lg">
            <div className="flex items-center gap-4">
              {selectedItem.mimeType.startsWith("image/") ? (
                <img src={selectedItem.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-light-gray text-muted-foreground">
                  {getFileIcon(selectedItem.mimeType)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy">{selectedItem.originalName}</p>
                <p className="text-xs text-muted-foreground">{selectedItem.mimeType} — {formatSize(selectedItem.size)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyUrl(selectedItem.url)} className="gap-1"><Copy className="h-3.5 w-3.5" /> Copy URL</Button>
                <Button variant="outline" size="sm" onClick={() => window.open(selectedItem.url, "_blank")} className="gap-1"><Eye className="h-3.5 w-3.5" /> View</Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteId(selectedItem.id)} className="gap-1 text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </div>
            </div>
          </motion.div>
        )}

        <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete File" message="This will permanently delete this file." confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} />
      </motion.div>
    </DashboardLayout>
  );
}
