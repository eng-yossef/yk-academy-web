"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const CATEGORIES = [
  { id: "cat-web-dev", name: "Web Development" },
  { id: "cat-programming", name: "Programming" },
  { id: "cat-ai", name: "AI & Data Science" },
  { id: "cat-mobile", name: "Mobile Development" },
  { id: "cat-devops", name: "DevOps" },
  { id: "cat-design", name: "Design" },
];

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    level: "BEGINNER" as string,
    price: 0,
    discountPrice: "",
    thumbnailUrl: "",
    trailerUrl: "",
    isPublished: false,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.categoryId) next.categoryId = "Category is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          shortDescription: form.shortDescription.trim() || undefined,
          categoryId: form.categoryId,
          level: form.level,
          price: form.price,
          discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
          isPublished: form.isPublished,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({ title: "Created", description: "Course created successfully" });
        router.push("/admin/courses");
      } else {
        toast({ title: "Error", description: data.error || "Failed to create course", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to create course", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Create Course"
          subtitle="Add a new course to the platform"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Courses", href: "/admin/courses" },
            { label: "New Course" },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                form="create-course-form"
                disabled={submitting}
                className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white"
              >
                <Save className="h-4 w-4" />
                {submitting ? "Creating..." : "Create Course"}
              </Button>
            </div>
          }
        />

        <form id="create-course-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-navy">Basic Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Course title"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={form.categoryId} onValueChange={(v) => update("categoryId", v)}>
                  <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={form.level} onValueChange={(v) => update("level", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (SAR)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price (SAR)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min={0}
                  placeholder="Optional"
                  value={form.discountPrice}
                  onChange={(e) => update("discountPrice", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  placeholder="https://..."
                  value={form.thumbnailUrl}
                  onChange={(e) => update("thumbnailUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailerUrl">Trailer URL</Label>
                <Input
                  id="trailerUrl"
                  placeholder="https://..."
                  value={form.trailerUrl}
                  onChange={(e) => update("trailerUrl", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Course description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                rows={2}
                placeholder="Brief summary (optional)"
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
              />
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <Switch checked={form.isPublished} onCheckedChange={(v) => update("isPublished", v)} />
                <Label>Published</Label>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
