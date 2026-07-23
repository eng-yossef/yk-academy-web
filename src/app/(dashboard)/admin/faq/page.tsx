"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = React.useState<FAQItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FAQItem | null>(null);
  const [form, setForm] = React.useState({ question: "", answer: "", category: "", isActive: true });
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    fetch(`/api/admin/faqs?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFaqs(data.data);
      })
      .catch(() => { toast({ title: "Error", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, categoryFilter, toast, refreshKey]);

  const categories = React.useMemo(() => {
    const cats = new Set(faqs.filter((f) => f.category).map((f) => f.category!));
    return ["all", ...Array.from(cats)];
  }, [faqs]);

  const openCreate = () => {
    setEditing(null);
    setForm({ question: "", answer: "", category: "", isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (faq: FAQItem) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category || "", isActive: faq.isActive });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/faqs/${editing.id}` : "/api/admin/faqs";
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
      await fetch(`/api/admin/faqs/${deleteId}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const toggleActive = async (faq: FAQItem) => {
    try {
      await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="FAQs"
          subtitle="Manage frequently asked questions"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "FAQs" }]}
          actions={
            <Button onClick={openCreate} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          }
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search FAQs..." value={search} onChange={setSearch} className="w-full sm:w-72" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-light-gray" />)}</div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <HelpCircle className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-navy">No FAQs yet</p>
            <Button onClick={openCreate} className="mt-4">Add your first FAQ</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-light-gray bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(faq.id)}>
                    <p className="font-medium text-navy">{faq.question}</p>
                  </div>
                  {faq.category && <Badge variant="secondary">{faq.category}</Badge>}
                  <Badge variant="secondary" className={cn(faq.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                    {faq.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Switch checked={faq.isActive} onCheckedChange={() => toggleActive(faq)} className="scale-75" />
                  <button onClick={() => toggleExpand(faq.id)} className="text-muted-foreground hover:text-navy">
                    {expanded.has(faq.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(faq)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(faq.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {expanded.has(faq.id) && (
                  <div className="border-t border-light-gray px-4 py-3 text-sm text-navy/70">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
              <DialogDescription>{editing ? "Update FAQ details" : "Create a new FAQ entry"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="e.g. General, Billing" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                <Label>Active</Label>
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

        <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete FAQ" message="Permanently delete this FAQ?" confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} />
      </motion.div>
    </DashboardLayout>
  );
}
