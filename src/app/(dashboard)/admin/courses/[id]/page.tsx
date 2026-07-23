"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  ArrowLeft,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Users,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  level: string;
  price: number;
  discountPrice: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  image: string | null;
  enrolledCount: number;
  rating: number;
  categoryId: string;
  instructorId: string;
  category: { id: string; name: string };
  instructor: { id: string; name: string; email: string };
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: { id: string; title: string; duration: number | null; order: number }[];
  }[];
  enrollments: {
    id: string;
    status: string;
    progress: number;
    enrolledAt: string;
    user: { id: string; name: string; email: string };
  }[];
}

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const courseId = params.id as string;

  const [course, setCourse] = React.useState<CourseDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("info");
  const [newModuleTitle, setNewModuleTitle] = React.useState("");
  const [addingModule, setAddingModule] = React.useState(false);
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(new Set());
  const [newLessonModuleId, setNewLessonModuleId] = React.useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = React.useState("");
  const [addingLesson, setAddingLesson] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`);
        const data = await res.json();
        if (data.success) setCourse(data.data);
      } catch {
        toast({ title: "Error", description: "Failed to load course", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, toast]);

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: course.title,
          description: course.description,
          shortDescription: course.shortDescription,
          level: course.level,
          price: course.price,
          discountPrice: course.discountPrice,
          isPublished: course.isPublished,
          isFeatured: course.isFeatured,
          tags: course.tags,
          categoryId: course.categoryId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Saved", description: "Course updated successfully" });
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setAddingModule(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newModuleTitle }),
      });
      const data = await res.json();
      if (data.success) {
        setCourse((prev) => prev ? { ...prev, modules: [...prev.modules, { ...data.data, lessons: [] }] } : prev);
        setNewModuleTitle("");
        toast({ title: "Added", description: "Module created" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to add module", variant: "destructive" });
    } finally {
      setAddingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, { method: "DELETE" });
      setCourse((prev) => prev ? { ...prev, modules: prev.modules.filter((m) => m.id !== moduleId) } : prev);
      toast({ title: "Deleted", description: "Module removed" });
    } catch {
      toast({ title: "Error", description: "Failed to delete module", variant: "destructive" });
    }
  };

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-light-gray" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout role="admin">
        <div className="flex h-64 items-center justify-center text-muted-foreground">Course not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title={course.title}
          subtitle={`Course ID: ${courseId}`}
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Courses", href: "/admin/courses" },
            { label: course.title },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="info" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Info
            </TabsTrigger>
            <TabsTrigger value="modules" className="gap-2">
              <GripVertical className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="gap-2">
              <Users className="h-4 w-4" />
              Enrollments ({course.enrollments.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={course.slug} disabled className="bg-light-gray/50" />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={course.level} onValueChange={(v) => setCourse({ ...course, level: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={course.category.name} disabled className="bg-light-gray/50" />
                </div>
                <div className="space-y-2">
                  <Label>Price (SAR)</Label>
                  <Input type="number" value={course.price} onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Discount Price (SAR)</Label>
                  <Input type="number" value={course.discountPrice ?? ""} onChange={(e) => setCourse({ ...course, discountPrice: parseFloat(e.target.value) || null })} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label>Description</Label>
                <Textarea rows={4} value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
              </div>
              <div className="mt-4 space-y-2">
                <Label>Short Description</Label>
                <Textarea rows={2} value={course.shortDescription ?? ""} onChange={(e) => setCourse({ ...course, shortDescription: e.target.value })} />
              </div>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Switch checked={course.isPublished} onCheckedChange={(v) => setCourse({ ...course, isPublished: v })} />
                  <Label>Published</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={course.isFeatured} onCheckedChange={(v) => setCourse({ ...course, isFeatured: v })} />
                  <Label>Featured</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Modules & Lessons</h3>

              <div className="mb-4 flex gap-2">
                <Input
                  placeholder="New module title..."
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
                />
                <Button onClick={handleAddModule} disabled={addingModule || !newModuleTitle.trim()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod) => (
                  <div key={mod.id} className="rounded-lg border border-light-gray">
                    <div className="flex items-center gap-3 bg-light-gray/30 px-4 py-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-navy">{mod.title}</span>
                      <Badge variant="secondary" className="ml-auto mr-2">{mod.lessons.length} lessons</Badge>
                      <button onClick={() => toggleModule(mod.id)} className="text-muted-foreground hover:text-navy">
                        {expandedModules.has(mod.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteModule(mod.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {expandedModules.has(mod.id) && (
                      <div className="p-4">
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 border-b border-light-gray py-2 last:border-0">
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-navy">{lesson.title}</span>
                            {lesson.duration && (
                              <span className="ml-auto text-xs text-muted-foreground">{lesson.duration} min</span>
                            )}
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 gap-1 text-electric-blue"
                          onClick={() => setNewLessonModuleId(newLessonModuleId === mod.id ? null : mod.id)}
                        >
                          <Plus className="h-3 w-3" />
                          Add Lesson
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {course.modules.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">No modules yet. Add your first module above.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-6">
            <div className="rounded-xl border border-light-gray bg-white shadow-sm">
              <div className="p-6">
                <h3 className="font-semibold text-navy">Enrolled Students</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Enrolled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-navy">{enrollment.user.name}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={enrollment.status === "ACTIVE" ? "default" : "secondary"}>
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-light-gray">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-electric-blue to-cyan"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{enrollment.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(enrollment.enrolledAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-light-gray bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-navy">{course.enrolledCount}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
              <div className="rounded-xl border border-light-gray bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-navy">{course.rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="rounded-xl border border-light-gray bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-navy">{course.modules.length}</p>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
