"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {   Filter, Eye, CheckCircle2, XCircle, Calendar, Download, Inbox } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

interface EnrollmentItem {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  user: { id: string; name: string; email: string };
  course: { id: string; title: string; price: number };
  payment?: { id: string; amount: number; status: string } | null;
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = React.useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [detailEnrollment, setDetailEnrollment] = React.useState<EnrollmentItem | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    fetch(`/api/admin/enrollments?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setEnrollments(data.data);
      })
      .catch(() => { toast({ title: "Error", description: "Failed to load enrollments", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, statusFilter, dateFrom, dateTo, toast, refreshKey]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Updated", description: `Enrollment ${status.toLowerCase()}` });
        setRefreshKey((k) => k + 1);
      }
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    COMPLETED: "bg-electric-blue/10 text-electric-blue",
    PENDING: "bg-amber-50 text-amber-700",
    CANCELLED: "bg-red-50 text-red-700",
    SUSPENDED: "bg-gray-100 text-gray-600",
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Enrollments"
          subtitle="Manage student enrollments"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Enrollments" }]}
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search by student or course..." value={search} onChange={setSearch} className="w-full sm:w-72" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36" />
            </div>
            <span className="text-muted-foreground">to</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 py-16">
            <Inbox className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No enrollments found</p>
            <p className="text-sm text-muted-foreground/70">Student enrollments will appear here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment, i) => (
                <motion.tr
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-navy">{enrollment.user.name}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-navy">{enrollment.course.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-medium", statusColors[enrollment.status])}>
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-light-gray">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-electric-blue to-cyan"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{enrollment.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(enrollment.enrolledAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailEnrollment(enrollment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {enrollment.status === "ACTIVE" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500" onClick={() => handleStatusChange(enrollment.id, "COMPLETED")}>
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      {enrollment.status !== "CANCELLED" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleStatusChange(enrollment.id, "CANCELLED")}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={!!detailEnrollment} onOpenChange={() => setDetailEnrollment(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enrollment Details</DialogTitle>
            </DialogHeader>
            {detailEnrollment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Student</p>
                    <p className="font-medium text-navy">{detailEnrollment.user.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-navy">{detailEnrollment.user.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Course</p>
                    <p className="font-medium text-navy">{detailEnrollment.course.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant="secondary" className={cn(statusColors[detailEnrollment.status])}>
                      {detailEnrollment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Progress</p>
                    <p className="font-medium text-navy">{detailEnrollment.progress}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enrolled</p>
                    <p className="text-navy">{formatDate(detailEnrollment.enrolledAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
