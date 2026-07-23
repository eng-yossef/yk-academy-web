"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Upload,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseName: string;
  dueDate: string;
  type: string;
  totalPoints: number;
  status: "PENDING" | "SUBMITTED" | "GRADED";
  grade?: number;
  feedback?: string;
  submittedAt?: string;
}

export default function StudentAssignmentsPage() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [submitDialog, setSubmitDialog] = useState<Assignment | null>(null);
  const [submitContent, setSubmitContent] = useState("");
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await fetch("/api/student/assignments");
        if (res.ok) {
          const json = await res.json();
          setAssignments(json.data);
        }
      } catch {
        setAssignments([
          { id: "1", title: "React Performance Optimization", description: "Optimize a React app using memo, useMemo, and React Profiler.", courseName: "Advanced React Patterns", dueDate: "2026-07-28T23:59:00Z", type: "PROJECT", totalPoints: 100, status: "PENDING" },
          { id: "2", title: "TypeScript Quiz #4", description: "Test your knowledge on generics and utility types.", courseName: "TypeScript Mastery", dueDate: "2026-07-30T23:59:00Z", type: "QUIZ", totalPoints: 50, status: "PENDING" },
          { id: "3", title: "REST API Design", description: "Design a RESTful API for an e-commerce platform.", courseName: "Node.js Backend", dueDate: "2026-07-20T23:59:00Z", type: "HOMEWORK", totalPoints: 100, status: "GRADED", grade: 92, feedback: "Excellent API design!", submittedAt: "2026-07-19T14:00:00Z" },
          { id: "4", title: "React Basics Quiz", description: "Fundamentals of React components and state.", courseName: "Advanced React Patterns", dueDate: "2026-07-15T23:59:00Z", type: "QUIZ", totalPoints: 30, status: "GRADED", grade: 28, feedback: "Good work!", submittedAt: "2026-07-14T18:00:00Z" },
          { id: "5", title: "Component Library Project", description: "Build a reusable component library.", courseName: "Advanced React Patterns", dueDate: "2026-07-10T23:59:00Z", type: "PROJECT", totalPoints: 100, status: "SUBMITTED", submittedAt: "2026-07-09T20:00:00Z" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  const pending = assignments.filter((a) => a.status === "PENDING");
  const submitted = assignments.filter((a) => a.status === "SUBMITTED");
  const graded = assignments.filter((a) => a.status === "GRADED");

  const handleSubmit = async () => {
    if (!submitDialog) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", submitDialog.id);
      formData.append("content", submitContent);
      if (submitFile) formData.append("file", submitFile);

      const res = await fetch(`/api/student/assignments/${submitDialog.id}/submit`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === submitDialog.id
              ? { ...a, status: "SUBMITTED" as const, submittedAt: new Date().toISOString() }
              : a
          )
        );
        toast({ title: "Submitted", description: "Your assignment has been submitted." });
        setSubmitDialog(null);
        setSubmitContent("");
        setSubmitFile(null);
      }
    } catch {
      toast({ title: "Error", description: "Failed to submit assignment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const typeColor: Record<string, string> = {
    PROJECT: "bg-purple-100 text-purple-700",
    QUIZ: "bg-amber-100 text-amber-700",
    HOMEWORK: "bg-blue-100 text-blue-700",
    EXAM: "bg-red-100 text-red-700",
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-light-gray bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-navy">{assignment.title}</h3>
            <Badge className={cn("text-xs", typeColor[assignment.type] ?? "bg-gray-100 text-gray-700")}>
              {assignment.type}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{assignment.courseName}</p>
          <p className="mt-2 text-sm text-navy/70 line-clamp-2">{assignment.description}</p>
        </div>

        {assignment.status === "GRADED" && assignment.grade !== undefined && (
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50">
            <span className="text-lg font-bold text-emerald-700">{assignment.grade}</span>
            <span className="text-[10px] text-emerald-600">/{assignment.totalPoints}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {isOverdue(assignment.dueDate) && assignment.status === "PENDING" ? (
              <span className="font-medium text-red-600">Overdue</span>
            ) : (
              <span>
                Due{" "}
                {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          {assignment.submittedAt && (
            <span>
              Submitted{" "}
              {new Date(assignment.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {assignment.status === "PENDING" && (
          <Button size="sm" onClick={() => setSubmitDialog(assignment)}>
            <Send className="mr-1 h-3 w-3" />
            Submit
          </Button>
        )}
        {assignment.status === "SUBMITTED" && (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Awaiting Grade
          </Badge>
        )}
        {assignment.status === "GRADED" && assignment.feedback && (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Graded
          </Badge>
        )}
      </div>

      {assignment.status === "GRADED" && assignment.feedback && (
        <div className="mt-3 rounded-lg bg-light-gray p-3">
          <p className="text-xs font-medium text-muted-foreground">Feedback:</p>
          <p className="mt-1 text-sm text-navy">{assignment.feedback}</p>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        subtitle="View and submit your course assignments"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Assignments" }]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({submitted.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            Graded ({graded.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pending.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="h-8 w-8" />}
              title="No pending assignments"
              description="You're all caught up!"
            />
          ) : (
            pending.map((a) => <AssignmentCard key={a.id} assignment={a} />)
          )}
        </TabsContent>

        <TabsContent value="submitted" className="mt-6 space-y-4">
          {submitted.length === 0 ? (
            <EmptyState
              icon={<Send className="h-8 w-8" />}
              title="No submitted assignments"
              description="Submit an assignment to see it here"
            />
          ) : (
            submitted.map((a) => <AssignmentCard key={a.id} assignment={a} />)
          )}
        </TabsContent>

        <TabsContent value="graded" className="mt-6 space-y-4">
          {graded.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-8 w-8" />}
              title="No graded assignments"
              description="Your graded assignments will appear here"
            />
          ) : (
            graded.map((a) => <AssignmentCard key={a.id} assignment={a} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!submitDialog} onOpenChange={() => setSubmitDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {submitDialog?.title} — {submitDialog?.courseName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Your Answer</label>
              <Textarea
                placeholder="Write your answer or paste a link..."
                value={submitContent}
                onChange={(e) => setSubmitContent(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Attachment (optional)</label>
              <Input
                type="file"
                onChange={(e) => setSubmitFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialog(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || (!submitContent.trim() && !submitFile)}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
