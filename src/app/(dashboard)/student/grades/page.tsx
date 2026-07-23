"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

interface GradeEntry {
  id: string;
  courseName: string;
  courseId: string;
  assignmentTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  feedback: string | null;
  date: string;
}

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("all");

  useEffect(() => {
    async function fetchGrades() {
      try {
        const res = await fetch("/api/student/grades");
        if (res.ok) {
          const json = await res.json();
          setGrades(json.data);
        }
      } catch {
        setGrades([
          { id: "1", courseName: "Advanced React Patterns", courseId: "c1", assignmentTitle: "React Performance Optimization", score: 92, maxScore: 100, percentage: 92, letterGrade: "A", feedback: "Excellent work!", date: "2026-07-20" },
          { id: "2", courseName: "Advanced React Patterns", courseId: "c1", assignmentTitle: "React Basics Quiz", score: 28, maxScore: 30, percentage: 93, letterGrade: "A", feedback: "Good work!", date: "2026-07-15" },
          { id: "3", courseName: "TypeScript Mastery", courseId: "c2", assignmentTitle: "TS Generics Quiz", score: 42, maxScore: 50, percentage: 84, letterGrade: "B+", feedback: "Review utility types", date: "2026-07-18" },
          { id: "4", courseName: "TypeScript Mastery", courseId: "c2", assignmentTitle: "Interface Design Project", score: 88, maxScore: 100, percentage: 88, letterGrade: "B+", feedback: null, date: "2026-07-12" },
          { id: "5", courseName: "Node.js Backend", courseId: "c3", assignmentTitle: "REST API Design", score: 95, maxScore: 100, percentage: 95, letterGrade: "A", feedback: "Outstanding!", date: "2026-07-10" },
          { id: "6", courseName: "CSS Fundamentals", courseId: "c4", assignmentTitle: "Final Exam", score: 46, maxScore: 50, percentage: 92, letterGrade: "A", feedback: null, date: "2026-07-05" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchGrades();
  }, []);

  const courses = useMemo(() => {
    const map = new Map<string, string>();
    grades.forEach((g) => map.set(g.courseId, g.courseName));
    return Array.from(map.entries());
  }, [grades]);

  const filtered = useMemo(() => {
    if (filterCourse === "all") return grades;
    return grades.filter((g) => g.courseId === filterCourse);
  }, [grades, filterCourse]);

  const overallGPA = useMemo(() => {
    if (grades.length === 0) return 0;
    const avg = grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length;
    return avg.toFixed(1);
  }, [grades]);

  const courseAverages = useMemo(() => {
    const map = new Map<string, { sum: number; count: number; name: string }>();
    grades.forEach((g) => {
      const existing = map.get(g.courseId) ?? { sum: 0, count: 0, name: g.courseName };
      existing.sum += g.percentage;
      existing.count += 1;
      map.set(g.courseId, existing);
    });
    return Array.from(map.entries()).map(([id, v]) => ({
      id,
      name: v.name,
      average: (v.sum / v.count).toFixed(1),
    }));
  }, [grades]);

  const letterGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade.startsWith("C")) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grades"
        subtitle="Track your academic performance across all courses"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Grades" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-light-gray bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue/10">
              <TrendingUp className="h-5 w-5 text-electric-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{overallGPA}%</p>
              <p className="text-xs text-muted-foreground">Overall Average</p>
            </div>
          </div>
        </motion.div>
        {courseAverages.slice(0, 3).map((ca, i) => (
          <motion.div
            key={ca.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 1) * 0.1 }}
            className="rounded-xl border border-light-gray bg-white p-5 shadow-sm"
          >
            <p className="truncate text-sm text-muted-foreground">{ca.name}</p>
            <p className="mt-1 text-2xl font-bold text-navy">{ca.average}%</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-light-gray bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">Performance Overview</h2>
        </div>
        <div className="flex items-end gap-2">
          {courseAverages.map((ca) => (
            <div key={ca.id} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-navy">{ca.average}%</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(Number(ca.average) * 1.5, 20)}px` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full rounded-t-lg bg-gradient-to-t from-electric-blue to-cyan"
              />
              <span className="w-full truncate text-center text-[10px] text-muted-foreground">
                {ca.name.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-light-gray bg-white shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-light-gray p-5">
          <h2 className="text-lg font-semibold text-navy">All Grades</h2>
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-gray text-left text-xs font-medium uppercase text-muted-foreground">
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Assignment</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Grade</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((grade) => (
                <tr key={grade.id} className="border-b border-light-gray/50 transition-colors hover:bg-light-gray/30">
                  <td className="px-5 py-3 text-sm font-medium text-navy">{grade.courseName}</td>
                  <td className="px-5 py-3 text-sm text-navy/70">{grade.assignmentTitle}</td>
                  <td className="px-5 py-3 text-sm text-navy">
                    {grade.score}/{grade.maxScore}
                    <span className="ml-1 text-muted-foreground">({grade.percentage}%)</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={cn("text-xs", letterGradeColor(grade.letterGrade))}>
                      {grade.letterGrade}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {new Date(grade.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12">
              <EmptyState icon={<BarChart3 className="h-8 w-8" />} title="No grades found" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
