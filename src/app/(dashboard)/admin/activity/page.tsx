"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Filter, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ActivityLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminActivityPage() {
  const [logs, setLogs] = React.useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (actionFilter !== "all") params.set("action", actionFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    params.set("page", page.toString());
    fetch(`/api/admin/activity?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(() => { toast({ title: "Error", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, actionFilter, dateFrom, dateTo, page, toast]);

  const actionColors: Record<string, string> = {
    CREATE: "bg-emerald-50 text-emerald-700",
    UPDATE: "bg-electric-blue/10 text-electric-blue",
    DELETE: "bg-red-50 text-red-700",
    LOGIN: "bg-amber-50 text-amber-700",
    LOGOUT: "bg-gray-100 text-gray-600",
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Activity Logs"
          subtitle="Track all system activity"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Activity" }]}
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search logs..." value={search} onChange={setSearch} className="w-full sm:w-72" />
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36" />
            <span className="text-muted-foreground">to</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(10)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-light-gray" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50"
                >
                  <TableCell>
                    <p className="text-sm font-medium text-navy">{log.user.name}</p>
                    <p className="text-xs text-muted-foreground">{log.user.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-medium", actionColors[log.action] || "bg-gray-100 text-gray-600")}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-navy/70">{log.entity}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{log.details || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.ipAddress || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(log.createdAt)}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
