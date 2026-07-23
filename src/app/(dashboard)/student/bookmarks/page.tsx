"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark as BookmarkIcon, X, Play, BookOpen, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/components/ui/use-toast";

interface BookmarkedLesson {
  id: string;
  bookmarkId: string;
  lessonId: string;
  lessonTitle: string;
  courseName: string;
  courseId: string;
  duration: number | null;
  createdAt: string;
}

export default function StudentBookmarksPage() {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<BookmarkedLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch("/api/student/bookmarks");
        if (res.ok) {
          const json = await res.json();
          setBookmarks(json.data);
        }
      } catch {
        setBookmarks([
          { id: "1", bookmarkId: "b1", lessonId: "l4", lessonTitle: "Building Custom Hooks", courseName: "Advanced React Patterns", courseId: "c1", duration: 1500, createdAt: "2026-07-22T10:00:00Z" },
          { id: "2", bookmarkId: "b2", lessonId: "l10", lessonTitle: "Generics Deep Dive", courseName: "TypeScript Mastery", courseId: "c2", duration: 1200, createdAt: "2026-07-21T15:00:00Z" },
          { id: "3", bookmarkId: "b3", lessonId: "l15", lessonTitle: "REST API Best Practices", courseName: "Node.js Backend", courseId: "c3", duration: 960, createdAt: "2026-07-20T09:00:00Z" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.bookmarkId !== bookmarkId));
    try {
      await fetch(`/api/student/bookmarks/${bookmarkId}`, { method: "DELETE" });
      toast({ title: "Bookmark removed" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookmarks"
        subtitle="Quick access to your saved lessons"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Bookmarks" }]}
      />

      {bookmarks.length === 0 && !loading ? (
        <EmptyState
          icon={<BookmarkIcon className="h-8 w-8" />}
          title="No bookmarks yet"
          description="Save lessons to quickly access them later"
        />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark, i) => (
            <motion.div
              key={bookmark.bookmarkId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-4 rounded-xl border border-light-gray bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-electric-blue/10 text-electric-blue">
                <Play className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-navy group-hover:text-electric-blue transition-colors">
                  {bookmark.lessonTitle}
                </h3>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  <span>{bookmark.courseName}</span>
                  {bookmark.duration && (
                    <>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(bookmark.duration)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/student/courses/${bookmark.courseId}?lesson=${bookmark.lessonId}`}>
                  <Button size="sm" variant="outline">
                    <Play className="mr-1 h-3 w-3" />
                    Go to Lesson
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                  onClick={() => handleRemoveBookmark(bookmark.bookmarkId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
