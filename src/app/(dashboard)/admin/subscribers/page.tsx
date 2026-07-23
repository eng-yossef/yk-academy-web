"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Download, Users, Mail, UserCheck, UserX } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatCard } from "@/components/shared/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface SubscriberItem {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = React.useState<SubscriberItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    fetch(`/api/admin/subscribers?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSubscribers(data.data);
      })
      .finally(() => setLoading(false));
  }, [search]);

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const inactiveCount = subscribers.filter((s) => !s.isActive).length;

  const handleExport = () => {
    const csv = [
      ["Email", "Name", "Status", "Subscribed"].join(","),
      ...subscribers.map((s) =>
        [s.email, s.name || "", s.isActive ? "Active" : "Inactive", formatDate(s.createdAt)].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Subscribers exported to CSV" });
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Newsletter Subscribers"
          subtitle={`${subscribers.length} total subscribers`}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Subscribers" }]}
          actions={
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          }
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total" value={subscribers.length} />
          <StatCard icon={<UserCheck className="h-5 w-5" />} label="Active" value={activeCount} />
          <StatCard icon={<UserX className="h-5 w-5" />} label="Inactive" value={inactiveCount} />
        </div>

        <div className="mb-6">
          <SearchInput placeholder="Search subscribers..." value={search} onChange={setSearch} className="w-full sm:w-72" />
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub, i) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-navy">{sub.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-navy/70">{sub.name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(sub.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                      {sub.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(sub.createdAt)}</TableCell>
                </motion.tr>
              ))}
              {subscribers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="py-12 text-center text-sm text-muted-foreground">No subscribers yet</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
