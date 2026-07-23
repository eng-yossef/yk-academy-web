"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Tag, ToggleLeft, ToggleRight, Copy } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface DiscountItem {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  maxUses: number | null;
  usedCount: number;
  minAmount: number | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = React.useState<DiscountItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DiscountItem | null>(null);
  const [form, setForm] = React.useState({
    code: "",
    description: "",
    type: "PERCENTAGE",
    value: 10,
    maxUses: "",
    minAmount: "",
    expiresAt: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    fetch(`/api/admin/discounts?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setDiscounts(data.data);
      })
      .catch(() => { toast({ title: "Error", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, toast, refreshKey]);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: "", description: "", type: "PERCENTAGE", value: 10, maxUses: "", minAmount: "", expiresAt: "" });
    setDialogOpen(true);
  };

  const openEdit = (d: DiscountItem) => {
    setEditing(d);
    setForm({
      code: d.code,
      description: d.description || "",
      type: d.type,
      value: d.value,
      maxUses: d.maxUses?.toString() || "",
      minAmount: d.minAmount?.toString() || "",
      expiresAt: d.expiresAt ? d.expiresAt.split("T")[0] : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/discounts/${editing.id}` : "/api/admin/discounts";
      const method = editing ? "PUT" : "POST";
      const body = {
        ...form,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        minAmount: form.minAmount ? parseFloat(form.minAmount) : null,
        expiresAt: form.expiresAt || null,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        toast({ title: editing ? "Updated" : "Created" });
        setDialogOpen(false);
        setRefreshKey((k) => k + 1);
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
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
      await fetch(`/api/admin/discounts/${deleteId}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const toggleActive = async (d: DiscountItem) => {
    try {
      await fetch(`/api/admin/discounts/${d.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !d.isActive }),
      });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: `"${code}" copied to clipboard` });
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Discount Codes"
          subtitle="Manage discount and promo codes"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Discounts" }]}
          actions={
            <Button onClick={openCreate} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
              <Plus className="h-4 w-4" />
              Create Code
            </Button>
          }
        />

        <div className="mb-6">
          <SearchInput placeholder="Search codes..." value={search} onChange={setSearch} className="w-full sm:w-72" />
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded-md bg-light-gray px-2 py-1 text-sm font-mono font-bold text-navy">{d.code}</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(d.code)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(d.type === "PERCENTAGE" ? "bg-electric-blue/10 text-electric-blue" : "bg-emerald-50 text-emerald-700")}>
                      {d.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-navy">
                    {d.type === "PERCENTAGE" ? `${d.value}%` : formatCurrency(d.value)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="text-navy">{d.usedCount}</span>
                    {d.maxUses && <span className="text-muted-foreground"> / {d.maxUses}</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {d.expiresAt ? formatDate(d.expiresAt) : "Never"}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleActive(d)} className="flex items-center gap-1">
                      {d.isActive ? (
                        <ToggleRight className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                      <Badge variant="secondary" className={cn(d.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                        {d.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(d)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(d.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Create"} Discount Code</DialogTitle>
              <DialogDescription>{editing ? "Update discount details" : "Add a new discount code"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input placeholder="e.g. SUMMER20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{form.type === "PERCENTAGE" ? "Percentage (%)" : "Amount (SAR)"}</Label>
                  <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Uses</Label>
                  <Input type="number" placeholder="Unlimited" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Min Purchase (SAR)</Label>
                  <Input type="number" placeholder="No minimum" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
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

        <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Code" message="Permanently delete this discount code?" confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} />
      </motion.div>
    </DashboardLayout>
  );
}
