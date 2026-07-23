"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Circle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  StickyNote,
  ArrowLeft,
  Loader2,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number | null;
  isFree: boolean;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  modules: Module[];
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface DiscussionPost {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  replies: number;
}

export default function StudentCourseLearningPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activePanel, setActivePanel] = useState<"notes" | "discussion">("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const [discussions] = useState<DiscussionPost[]>([
    { id: "1", author: "Ali", content: "Can someone explain the difference between useEffect and useLayoutEffect?", createdAt: "2026-07-22T10:00:00Z", replies: 3 },
    { id: "2", author: "Sara", content: "Great lesson! Very clear explanation.", createdAt: "2026-07-21T15:30:00Z", replies: 1 },
  ]);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/student/courses/${courseId}`);
        if (res.ok) {
          const json = await res.json();
          setCourse(json.data);
          if (json.data.modules?.[0]?.lessons?.[0]) {
            setActiveLessonId(json.data.modules[0].lessons[0].id);
            setExpandedModules(new Set([json.data.modules[0].id]));
          }
        }
      } catch {
        setCourse({
          id: courseId,
          title: "Advanced React Patterns",
          progress: 72,
          totalLessons: 24,
          completedLessons: 17,
          modules: [
            {
              id: "m1", title: "Module 1: React Fundamentals Review", order: 1,
              lessons: [
                { id: "l1", title: "Introduction to React 19", videoUrl: null, duration: 840, isFree: true, status: "COMPLETED" },
                { id: "l2", title: "JSX Deep Dive", videoUrl: null, duration: 1200, isFree: false, status: "COMPLETED" },
                { id: "l3", title: "Component Lifecycle", videoUrl: null, duration: 960, isFree: false, status: "COMPLETED" },
              ],
            },
            {
              id: "m2", title: "Module 2: Custom Hooks", order: 2,
              lessons: [
                { id: "l4", title: "Building Custom Hooks", videoUrl: null, duration: 1500, isFree: false, status: "IN_PROGRESS" },
                { id: "l5", title: "Advanced Hook Patterns", videoUrl: null, duration: 1800, isFree: false, status: "NOT_STARTED" },
              ],
            },
            {
              id: "m3", title: "Module 3: State Management", order: 3,
              lessons: [
                { id: "l6", title: "Context API Patterns", videoUrl: null, duration: 1200, isFree: false, status: "NOT_STARTED" },
                { id: "l7", title: "Zustand vs Redux", videoUrl: null, duration: 1600, isFree: false, status: "NOT_STARTED" },
              ],
            },
          ],
        });
        setActiveLessonId("l4");
        setExpandedModules(new Set(["m1", "m2"]));
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const activeLesson = course?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === activeLessonId);

  const handleMarkComplete = async (lessonId: string) => {
    try {
      await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, courseId, status: "COMPLETED" }),
      });
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, status: "COMPLETED" as const } : l
            ),
          })),
        };
      });
    } catch {}
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      const res = await fetch("/api/student/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: activeLessonId, content: noteText }),
      });
      if (res.ok) {
        const json = await res.json();
        setNotes((prev) => [json.data, ...prev]);
        setNoteText("");
      }
    } catch {}
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleLessonClick = (lessonId: string) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveLessonId(lessonId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/student/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-navy">{course.title}</h1>
          <div className="mt-1 flex items-center gap-3">
            <Progress value={course.progress} className="h-1.5 w-40" />
            <span className="text-xs text-muted-foreground">
              {course.completedLessons}/{course.totalLessons} lessons • {course.progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video w-full rounded-xl bg-navy shadow-lg"
          >
            {activeLesson?.videoUrl ? (
              <video
                ref={videoRef}
                src={activeLesson.videoUrl}
                controls
                className="h-full w-full rounded-xl"
                onError={(e) => {
                  const error = (e.target as HTMLVideoElement).error;
                  if (error && error.code !== 3) {
                    console.error('Video error:', error.message);
                  }
                }}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-white/70">
                <Play className="h-16 w-16" />
                <p className="mt-3 text-sm">{activeLesson?.title ?? "Select a lesson"}</p>
              </div>
            )}
          </motion.div>

          {activeLesson && (
            <div className="rounded-xl border border-light-gray bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">{activeLesson.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                {activeLesson.duration && (
                  <span>Duration: {formatDuration(activeLesson.duration)}</span>
                )}
                <Badge variant={activeLesson.status === "COMPLETED" ? "default" : "outline"}>
                  {activeLesson.status.replace("_", " ")}
                </Badge>
              </div>
              {activeLesson.status !== "COMPLETED" && (
                <Button
                  className="mt-4"
                  onClick={() => handleMarkComplete(activeLesson.id)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
              )}
            </div>
          )}

          <div className="rounded-xl border border-light-gray bg-white shadow-sm">
            <div className="flex border-b border-light-gray">
              <button
                onClick={() => setActivePanel("notes")}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
                  activePanel === "notes"
                    ? "border-b-2 border-electric-blue text-electric-blue"
                    : "text-muted-foreground hover:text-navy"
                )}
              >
                <StickyNote className="h-4 w-4" />
                Notes
              </button>
              <button
                onClick={() => setActivePanel("discussion")}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
                  activePanel === "discussion"
                    ? "border-b-2 border-electric-blue text-electric-blue"
                    : "text-muted-foreground hover:text-navy"
                )}
              >
                <MessageSquare className="h-4 w-4" />
                Discussion ({discussions.length})
              </button>
            </div>

            <div className="p-5">
              {activePanel === "notes" ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Write a note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button onClick={handleAddNote} className="self-end">
                      Add
                    </Button>
                  </div>
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-lg bg-light-gray p-3">
                      <p className="text-sm text-navy">{note.content}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No notes yet. Start writing!
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {discussions.map((d) => (
                    <div key={d.id} className="rounded-lg border border-light-gray p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-navy">{d.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-navy/80">{d.content}</p>
                      <p className="mt-2 text-xs text-electric-blue">
                        {d.replies} {d.replies === 1 ? "reply" : "replies"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-light-gray bg-white shadow-sm">
          <div className="border-b border-light-gray p-4">
            <h3 className="font-semibold text-navy">Course Content</h3>
          </div>
          <ScrollArea className="max-h-[calc(100vh-220px)]">
            <div className="p-3">
              {course.modules.map((mod) => (
                <div key={mod.id} className="mb-2">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-navy transition-colors hover:bg-light-gray"
                  >
                    {expandedModules.has(mod.id) ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    {mod.title}
                  </button>
                  {expandedModules.has(mod.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="ml-4 mt-1 space-y-0.5"
                    >
                      {mod.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                            activeLessonId === lesson.id
                              ? "bg-electric-blue/10 text-electric-blue"
                              : "text-navy/70 hover:bg-light-gray hover:text-navy"
                          )}
                        >
                          {lesson.status === "COMPLETED" ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : lesson.status === "IN_PROGRESS" ? (
                            <Play className="h-4 w-4 shrink-0 text-electric-blue" />
                          ) : lesson.isFree ? (
                            <Circle className="h-4 w-4 shrink-0" />
                          ) : (
                            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                          {lesson.duration && (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {formatDuration(lesson.duration)}
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
