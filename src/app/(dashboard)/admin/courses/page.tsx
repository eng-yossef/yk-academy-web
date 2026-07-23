"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreHorizontal, Star, Users, BookOpen } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  category: { name: string };
  instructor: { name: string };
  enrolledCount: number;
  rating: number;
  isPublished: boolean;
  price: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<CourseItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    fetch(`/api/admin/courses?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCourses(data.data);
      })
      .catch(() => { toast({ title: "Error", description: "Failed to load courses", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, statusFilter, toast, refreshKey]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/courses/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Deleted", description: "Course deleted successfully" });
        setRefreshKey((k) => k + 1);
      } else {
        toast({ title: "Error", description: data.error || "Failed to delete", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Courses"
          subtitle="Manage all courses"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Courses" },
          ]}
          actions={
            <Link href="/admin/courses/new">
              <Button className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </Link>
          }
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search courses..." value={search} onChange={setSearch} className="w-full sm:w-72" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={<BookOpenIcon />}
            title="No courses found"
            description="Create your first course to get started"
            action={{ label: "Create Course", onClick: () => {} }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-navy">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(course.price)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.category.name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-navy/70">{course.instructor.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{course.enrolledCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{course.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={course.isPublished ? "default" : "secondary"}
                      className={cn(
                        course.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(course.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Delete Course"
          message="Are you sure? This will permanently delete the course and all its data."
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={handleDelete}
          loading={deleting}
        />
      </motion.div>
    </DashboardLayout>
  );
}

function BookOpenIcon() {
  return <BookOpen className="h-8 w-8" />;
}
