"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Award, Download, Send, Eye, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface CertificateItem {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  template: string | null;
  pdfUrl: string | null;
  verificationUrl: string | null;
  user: { id: string; name: string; email: string };
  course: { id: string; title: string };
}

interface CourseOption {
  id: string;
  title: string;
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = React.useState<CertificateItem[]>([]);
  const [courses, setCourses] = React.useState<CourseOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [issueOpen, setIssueOpen] = React.useState(false);
  const [form, setForm] = React.useState({ userId: "", courseId: "", template: "standard" });
  const [issuing, setIssuing] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    fetch("/api/admin/courses").then((r) => r.json()).then((d) => {
      if (d.success) setCourses(d.data);
    });
    fetch(`/api/admin/certificates?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCertificates(data.data);
      })
      .catch(() => { toast({ title: "Error", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, toast, refreshKey]);

  const handleIssue = async () => {
    setIssuing(true);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Issued", description: "Certificate issued" });
        setIssueOpen(false);
        setRefreshKey((k) => k + 1);
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIssuing(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Certificates"
          subtitle="Manage issued certificates"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Certificates" }]}
          actions={
            <Button onClick={() => setIssueOpen(true)} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
              <Plus className="h-4 w-4" />
              Issue Certificate
            </Button>
          }
        />

        <div className="mb-6">
          <SearchInput placeholder="Search certificates..." value={search} onChange={setSearch} className="w-full sm:w-72" />
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate #</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert, i) => (
                <motion.tr key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="font-mono text-sm font-medium text-navy">{cert.certificateNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-navy">{cert.user.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-navy">{cert.course.title}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{cert.template || "Standard"}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(cert.issuedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Send">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Issue Certificate</DialogTitle>
              <DialogDescription>Issue a new certificate to a student</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input placeholder="Enter student user ID" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={form.template} onValueChange={(v) => setForm({ ...form, template: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="honors">Honors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIssueOpen(false)}>Cancel</Button>
              <Button onClick={handleIssue} disabled={issuing} className="bg-gradient-to-r from-electric-blue to-cyan text-white">
                {issuing ? "Issuing..." : "Issue"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
