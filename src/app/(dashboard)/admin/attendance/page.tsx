"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface CourseOption {
  id: string;
  title: string;
}

interface AttendanceStudent {
  userId: string;
  userName: string;
  userEmail: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  note: string;
}

export default function AdminAttendancePage() {
  const { toast } = useToast();
  const [courses, setCourses] = React.useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = React.useState<AttendanceStudent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCourses(data.data.map((c: CourseOption) => ({ id: c.id, title: c.title })));
      });
  }, []);

  React.useEffect(() => {
    if (!selectedCourse) return;
    fetch(`/api/admin/enrollments?courseId=${selectedCourse}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStudents(
            data.data.map((e: { user: { id: string; name: string; email: string } }) => ({
              userId: e.user.id,
              userName: e.user.name,
              userEmail: e.user.email,
              status: "PRESENT" as const,
              note: "",
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  const updateStatus = (userId: string, status: AttendanceStudent["status"]) => {
    setStudents((prev) =>
      prev.map((s) => (s.userId === userId ? { ...s, status } : s))
    );
  };

  const markAll = (status: AttendanceStudent["status"]) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          date: selectedDate,
          records: students,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Saved", description: "Attendance recorded" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save attendance", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    present: students.filter((s) => s.status === "PRESENT").length,
    absent: students.filter((s) => s.status === "ABSENT").length,
    late: students.filter((s) => s.status === "LATE").length,
    excused: students.filter((s) => s.status === "EXCUSED").length,
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PRESENT: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    ABSENT: <XCircle className="h-5 w-5 text-red-500" />,
    LATE: <Clock className="h-5 w-5 text-amber-500" />,
    EXCUSED: <AlertCircle className="h-5 w-5 text-violet-500" />,
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Attendance"
          subtitle="Track student attendance"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Attendance" }]}
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />} label="Present" value={stats.present} />
          <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} label="Absent" value={stats.absent} />
          <StatCard icon={<Clock className="h-5 w-5 text-amber-500" />} label="Late" value={stats.late} />
          <StatCard icon={<AlertCircle className="h-5 w-5 text-violet-500" />} label="Excused" value={stats.excused} />
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-light-gray bg-white p-6 shadow-sm sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label>Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-44" />
          </div>
          <Button onClick={() => markAll("PRESENT")} variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark All Present
          </Button>
          <Button onClick={handleSave} disabled={saving || !selectedCourse || students.length === 0} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />
            ))}
          </div>
        ) : students.length > 0 ? (
          <div className="rounded-xl border border-light-gray bg-white shadow-sm">
            <div className="p-4">
              <h3 className="font-semibold text-navy">
                Students ({students.length})
              </h3>
            </div>
            <div className="divide-y divide-light-gray">
              {students.map((student, i) => (
                <motion.div
                  key={student.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-gray text-sm font-semibold text-navy">
                    {student.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{student.userName}</p>
                    <p className="text-xs text-muted-foreground">{student.userEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(student.userId, status)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all",
                          student.status === status
                            ? status === "PRESENT"
                              ? "border-emerald-500 bg-emerald-50"
                              : status === "ABSENT"
                                ? "border-red-500 bg-red-50"
                                : status === "LATE"
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-violet-500 bg-violet-50"
                            : "border-light-gray hover:border-gray-300"
                        )}
                        title={status}
                      >
                        {statusIcons[status]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : selectedCourse ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">No students enrolled in this course</div>
        ) : (
          <div className="flex h-48 items-center justify-center text-muted-foreground">Select a course to view attendance</div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
