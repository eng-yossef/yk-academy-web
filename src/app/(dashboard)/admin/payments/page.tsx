"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {   Filter, DollarSign, TrendingUp, CreditCard, ArrowDownRight, Download, Inbox } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatCard } from "@/components/shared/stat-card";
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
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  invoiceNumber: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  enrollment: { course: { title: string } };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [methodFilter, setMethodFilter] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (methodFilter !== "all") params.set("method", methodFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    fetch(`/api/admin/payments?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPayments(data.data);
      })
      .catch(() => { toast({ title: "Error", description: "Failed to load payments", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, statusFilter, methodFilter, dateFrom, dateTo, toast]);

  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = payments
    .filter((p) => p.status === "REFUNDED")
    .reduce((sum, p) => sum + p.amount, 0);

  const statusColors: Record<string, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    FAILED: "bg-red-50 text-red-700",
    REFUNDED: "bg-violet-50 text-violet-700",
    CANCELLED: "bg-gray-100 text-gray-600",
  };

  const handleExport = () => {
    const csv = [
      ["Student", "Course", "Amount", "Method", "Status", "Date"].join(","),
      ...payments.map((p) =>
        [
          p.user.name,
          p.enrollment.course.title,
          p.amount,
          p.method,
          p.status,
          formatDate(p.createdAt),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Payments exported to CSV" });
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Payments"
          subtitle="Track all transactions"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Payments" }]}
          actions={
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          }
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Revenue" value={formatCurrency(totalRevenue)} trend={{ value: 18, isPositive: true }} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Pending" value={formatCurrency(pendingAmount)} />
          <StatCard icon={<ArrowDownRight className="h-5 w-5" />} label="Refunded" value={formatCurrency(refundedAmount)} />
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search..." value={search} onChange={setSearch} className="w-full sm:w-72" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Method" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="STRIPE">Stripe</SelectItem>
              <SelectItem value="PAYMOB">Paymob</SelectItem>
              <SelectItem value="FAWRY">Fawry</SelectItem>
              <SelectItem value="VODAFONE_CASH">Vodafone Cash</SelectItem>
              <SelectItem value="INSTAPAY">InstaPay</SelectItem>
              <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36" />
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
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 py-16">
            <Inbox className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No payments found</p>
            <p className="text-sm text-muted-foreground/70">Transactions will appear here once students start enrolling.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, i) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-navy">{payment.user.name}</p>
                      <p className="text-xs text-muted-foreground">{payment.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-navy">{payment.enrollment.course.title}</TableCell>
                  <TableCell className="font-semibold text-navy">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{payment.method.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-medium", statusColors[payment.status])}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
