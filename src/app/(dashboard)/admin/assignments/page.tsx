"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Eye, Trash2, FileText, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface AssignmentItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  totalPoints: number;
  isPublished: boolean;
  dueDate: string | null;
  createdAt: string;
  course: { id: string; title: string };
  _count?: { submissions: number };
}

interface CourseOption {
  id: string;
  title: string;
}

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = React.useState<AssignmentItem[]>([]);
  const [courses, setCourses] = React.useState<CourseOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AssignmentItem | null>(null);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    type: "HOMEWORK",
    totalPoints: 100,
    courseId: "",
    dueDate: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [submissionsFor, setSubmissionsFor] = React.useState<AssignmentItem | null>(null);
  const [submissions, setSubmissions] = React.useState<{ id: string; student: { name: string; email: string }; grade: number | null; feedback: string | null; status: string; submittedAt: string }[]>([]);
  const { toast } = useToast();

  const refetchAssignments = React.useCallback(() => {
    fetch(`/api/admin/assignments?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAssignments(data.data);
      })
      .catch(() => { toast({ title: "Error", description: "Failed to load assignments", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, toast]);

  React.useEffect(() => {
    fetch("/api/admin/courses").then((r) => r.json()).then((d) => {
      if (d.success) setCourses(d.data);
    });
    refetchAssignments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    refetchAssignments();
  }, [refetchAssignments]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", type: "HOMEWORK", totalPoints: 100, courseId: "", dueDate: "" });
    setDialogOpen(true);
  };

  const openEdit = (a: AssignmentItem) => {
    setEditing(a);
    setForm({
      title: a.title,
      description: a.description || "",
      type: a.type,
      totalPoints: a.totalPoints,
      courseId: a.course.id,
      dueDate: a.dueDate ? a.dueDate.split("T")[0] : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/assignments/${editing.id}` : "/api/admin/assignments";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: editing ? "Updated" : "Created", description: "Assignment saved" });
        setDialogOpen(false);
        refetchAssignments();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/assignments/${deleteId}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      refetchAssignments();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const viewSubmissions = async (assignment: AssignmentItem) => {
    setSubmissionsFor(assignment);
    try {
      const res = await fetch(`/api/admin/assignments/${assignment.id}/submissions`);
      const data = await res.json();
      if (data.success) setSubmissions(data.data);
    } catch {
      setSubmissions([]);
    }
  };

  const typeColors: Record<string, string> = {
    HOMEWORK: "bg-electric-blue/10 text-electric-blue",
    QUIZ: "bg-amber-50 text-amber-700",
    EXAM: "bg-red-50 text-red-700",
    PROJECT: "bg-emerald-50 text-emerald-700",
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Assignments"
          subtitle="Manage course assignments"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Assignments" }]}
          actions={
            <Button onClick={openCreate} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          }
        />

        <div className="mb-6">
          <SearchInput placeholder="Search assignments..." value={search} onChange={setSearch} className="w-full sm:w-72" />
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50">
                  <TableCell>
                    <p className="font-medium text-navy">{a.title}</p>
                    {a.description && <p className="max-w-xs truncate text-xs text-muted-foreground">{a.description}</p>}
                  </TableCell>
                  <TableCell className="text-sm text-navy/70">{a.course.title}</TableCell>
                  <TableCell><Badge variant="secondary" className={cn("font-medium", typeColors[a.type])}>{a.type}</Badge></TableCell>
                  <TableCell className="text-sm">{a.totalPoints}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.dueDate ? formatDate(a.dueDate) : "—"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => viewSubmissions(a)} className="gap-1 text-electric-blue">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(a.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Assignment" : "Create Assignment"}</DialogTitle>
              <DialogDescription>{editing ? "Update assignment details" : "Add a new assignment"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOMEWORK">Homework</SelectItem>
                      <SelectItem value="QUIZ">Quiz</SelectItem>
                      <SelectItem value="EXAM">Exam</SelectItem>
                      <SelectItem value="PROJECT">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input type="number" value={form.totalPoints} onChange={(e) => setForm({ ...form, totalPoints: parseInt(e.target.value) || 100 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-electric-blue to-cyan text-white">
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!submissionsFor} onOpenChange={() => { setSubmissionsFor(null); setSubmissions([]); }}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submissions — {submissionsFor?.title}</DialogTitle>
            </DialogHeader>
            {submissions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No submissions yet</p>
            ) : (
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {submissions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-light-gray p-3">
                    <div>
                      <p className="text-sm font-medium text-navy">{s.student.name}</p>
                      <p className="text-xs text-muted-foreground">Submitted {formatDate(s.submittedAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={s.status === "GRADED" ? "default" : "secondary"}>
                        {s.status} {s.grade !== null && `— ${s.grade}`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Assignment" message="This will permanently delete this assignment." confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} />
      </motion.div>
    </DashboardLayout>
  );
}
