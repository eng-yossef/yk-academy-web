"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, ImagePlus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    category: "",
    tags: "",
    status: "DRAFT",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || slugify(title),
    }));
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: publish ? "PUBLISHED" : "DRAFT",
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          seoKeywords: form.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: publish ? "Published" : "Saved", description: "Blog post saved" });
        router.push("/admin/blog");
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="New Blog Post"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Blog", href: "/admin/blog" },
            { label: "New" },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={() => handleSave(false)} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave(true)} disabled={saving} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
                {saving ? "Publishing..." : "Publish"}
              </Button>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Enter post title..."
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor
                    value={form.content}
                    onChange={(v) => setForm({ ...form, content: v })}
                    placeholder="Write your post content..."
                    minHeight={400}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">SEO</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    placeholder="Custom title for search engines"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    rows={2}
                    placeholder="Brief description for search results"
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Keywords (comma separated)</Label>
                  <Input
                    placeholder="react, tutorial, web development"
                    value={form.seoKeywords}
                    onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Publishing</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Cover Image</h3>
              <div className="space-y-4">
                <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-light-gray bg-light-gray/30">
                  {form.coverImage ? (
                    <img src={form.coverImage} alt="Cover" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-xs text-muted-foreground">Click to upload</p>
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Or enter image URL"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g. Tutorials, News"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    placeholder="react, javascript, tips"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea
                    rows={3}
                    placeholder="Short summary of the post"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
