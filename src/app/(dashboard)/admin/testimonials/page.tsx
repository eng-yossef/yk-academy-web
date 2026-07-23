"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Star, StarOff, Edit, Trash2, Quote, Check, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface TestimonialItem {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number | null;
  image: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<TestimonialItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TestimonialItem | null>(null);
  const [form, setForm] = React.useState({ name: "", role: "", content: "", rating: 5, isFeatured: false, isActive: true });
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTestimonials(data.data);
      })
      .catch(() => { toast({ title: "Error", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [toast, refreshKey]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", role: "", content: "", rating: 5, isFeatured: false, isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (t: TestimonialItem) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role || "", content: t.content, rating: t.rating || 5, isFeatured: t.isFeatured, isActive: t.isActive });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/testimonials/${editing.id}` : "/api/admin/testimonials";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        toast({ title: editing ? "Updated" : "Created" });
        setDialogOpen(false);
        setRefreshKey((k) => k + 1);
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const toggleFeatured = async (t: TestimonialItem) => {
    try {
      await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !t.isFeatured }),
      });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Testimonials"
          subtitle="Manage student testimonials"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Testimonials" }]}
          actions={
            <Button onClick={openCreate} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          }
        />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 animate-pulse rounded-xl bg-light-gray" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
                  t.isFeatured ? "border-amber-200 ring-1 ring-amber-100" : "border-light-gray"
                )}
              >
                <div className="mb-3 flex items-start justify-between">
                  <Quote className="h-8 w-8 text-electric-blue/20" />
                  {t.isFeatured && <Badge className="bg-amber-50 text-amber-700">Featured</Badge>}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-navy/70">{t.content}</p>
                {t.rating && (
                  <div className="mb-3 flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={cn("h-4 w-4", s < t.rating! ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 border-t border-light-gray pt-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-sm font-bold text-navy">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy">{t.name}</p>
                    {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFeatured(t)} title={t.isFeatured ? "Unfeature" : "Feature"}>
                      {t.isFeatured ? <StarOff className="h-4 w-4 text-amber-500" /> : <Star className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Add"} Testimonial</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role / Title</Label><Input placeholder="e.g. Software Engineer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
              <div className="space-y-2"><Label>Testimonial</Label><Textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3"><Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} /><Label>Featured</Label></div>
                <div className="flex items-center gap-3"><Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /><Label>Active</Label></div>
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

        <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Testimonial" message="Permanently delete this testimonial?" confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} />
      </motion.div>
    </DashboardLayout>
  );
}
