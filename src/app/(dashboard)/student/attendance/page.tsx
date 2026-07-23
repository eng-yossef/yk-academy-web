"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  courseName: string;
  courseId: string;
  note: string | null;
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterCourse, setFilterCourse] = useState("all");

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await fetch("/api/student/attendance");
        if (res.ok) {
          const json = await res.json();
          setRecords(json.data);
        }
      } catch {
        const now = new Date();
        setRecords([
          { id: "1", date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), status: "PRESENT", courseName: "Advanced React", courseId: "c1", note: null },
          { id: "2", date: new Date(now.getFullYear(), now.getMonth(), 3).toISOString(), status: "PRESENT", courseName: "Advanced React", courseId: "c1", note: null },
          { id: "3", date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(), status: "LATE", courseName: "Advanced React", courseId: "c1", note: "Arrived 10 min late" },
          { id: "4", date: new Date(now.getFullYear(), now.getMonth(), 7).toISOString(), status: "ABSENT", courseName: "TypeScript Mastery", courseId: "c2", note: null },
          { id: "5", date: new Date(now.getFullYear(), now.getMonth(), 8).toISOString(), status: "PRESENT", courseName: "TypeScript Mastery", courseId: "c2", note: null },
          { id: "6", date: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(), status: "PRESENT", courseName: "Advanced React", courseId: "c1", note: null },
          { id: "7", date: new Date(now.getFullYear(), now.getMonth(), 12).toISOString(), status: "EXCUSED", courseName: "TypeScript Mastery", courseId: "c2", note: "Medical appointment" },
          { id: "8", date: new Date(now.getFullYear(), now.getMonth(), 14).toISOString(), status: "PRESENT", courseName: "Advanced React", courseId: "c1", note: null },
          { id: "9", date: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(), status: "LATE", courseName: "TypeScript Mastery", courseId: "c2", note: null },
          { id: "10", date: new Date(now.getFullYear(), now.getMonth(), 17).toISOString(), status: "PRESENT", courseName: "Advanced React", courseId: "c1", note: null },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, []);

  const courses = useMemo(() => {
    const map = new Map<string, string>();
    records.forEach((r) => map.set(r.courseId, r.courseName));
    return Array.from(map.entries());
  }, [records]);

  const filtered = useMemo(() => {
    if (filterCourse === "all") return records;
    return records.filter((r) => r.courseId === filterCourse);
  }, [records, filterCourse]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const present = filtered.filter((r) => r.status === "PRESENT").length;
    const late = filtered.filter((r) => r.status === "LATE").length;
    const absent = filtered.filter((r) => r.status === "ABSENT").length;
    const excused = filtered.filter((r) => r.status === "EXCUSED").length;
    const attendanceRate = total > 0 ? (((present + late) / total) * 100).toFixed(1) : "0";
    return { total, present, late, absent, excused, attendanceRate };
  }, [filtered]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const map = new Map<number, AttendanceRecord[]>();
    filtered.forEach((r) => {
      const d = new Date(r.date);
      if (d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()) {
        const day = d.getDate();
        const existing = map.get(day) ?? [];
        existing.push(r);
        map.set(day, existing);
      }
    });
    return map;
  }, [filtered, currentMonth]);

  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    PRESENT: { color: "bg-emerald-500", icon: <CheckCircle2 className="h-3 w-3" />, label: "Present" },
    ABSENT: { color: "bg-red-500", icon: <XCircle className="h-3 w-3" />, label: "Absent" },
    LATE: { color: "bg-amber-500", icon: <Clock className="h-3 w-3" />, label: "Late" },
    EXCUSED: { color: "bg-blue-500", icon: <AlertTriangle className="h-3 w-3" />, label: "Excused" },
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        subtitle="Track your attendance across all enrolled courses"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Attendance" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Attendance Rate", value: `${stats.attendanceRate}%`, color: "text-electric-blue" },
          { label: "Present", value: stats.present, color: "text-emerald-600" },
          { label: "Late", value: stats.late, color: "text-amber-600" },
          { label: "Absent", value: stats.absent, color: "text-red-600" },
          { label: "Excused", value: stats.excused, color: "text-blue-600" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-light-gray bg-white p-4 text-center shadow-sm"
          >
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(([id, name]) => (
              <SelectItem key={id} value={id}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Calendar</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="rounded-lg px-3 py-1 text-sm hover:bg-light-gray">
                Prev
              </button>
              <span className="min-w-[140px] text-center text-sm font-medium text-navy">
                {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button onClick={nextMonth} className="rounded-lg px-3 py-1 text-sm hover:bg-light-gray">
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayRecords = calendarDays.get(day) ?? [];
              return (
                <div
                  key={day}
                  className={cn(
                    "flex min-h-[48px] flex-col items-center rounded-lg p-1 text-sm transition-colors hover:bg-light-gray",
                    dayRecords.length > 0 && "bg-light-gray/50"
                  )}
                >
                  <span className="text-navy">{day}</span>
                  <div className="mt-0.5 flex gap-0.5">
                    {dayRecords.map((r) => (
                      <div
                        key={r.id}
                        className={cn("h-1.5 w-1.5 rounded-full", statusConfig[r.status].color)}
                        title={`${r.courseName} - ${statusConfig[r.status].label}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {Object.values(statusConfig).map((s) => (
              <div key={s.label} className="flex items-center gap-1">
                <div className={cn("h-2 w-2 rounded-full", s.color)} />
                {s.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-semibold text-navy">Per-Course Breakdown</h3>
          {courses.map(([id, name]) => {
            const courseRecords = filtered.filter((r) => r.courseId === id);
            const total = courseRecords.length;
            const present = courseRecords.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
            const rate = total > 0 ? ((present / total) * 100).toFixed(0) : "0";
            return (
              <div key={id} className="rounded-xl border border-light-gray bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-navy">{name}</p>
                  <span className="text-sm font-bold text-electric-blue">{rate}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-light-gray">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rate}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-electric-blue to-cyan"
                  />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{total} sessions</span>
                  <span>{present} attended</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
