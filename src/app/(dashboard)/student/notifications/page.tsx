"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  GraduationCap,
  CreditCard,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const nowRef = useState(() => Date.now())[0];

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/student/notifications");
        if (res.ok) {
          const json = await res.json();
          setNotifications(json.data);
        }
      } catch {
        setNotifications([
          { id: "1", title: "Assignment Graded", message: "Your React quiz has been graded with 92/100.", type: "SUCCESS", isRead: false, link: "/student/grades", createdAt: "2026-07-22T10:00:00Z" },
          { id: "2", title: "New Course Material", message: "New lesson \"Advanced Patterns\" added to React course.", type: "INFO", isRead: false, link: "/student/courses/1", createdAt: "2026-07-21T14:30:00Z" },
          { id: "3", title: "Assignment Due Soon", message: "TypeScript Quiz #4 is due in 2 days.", type: "WARNING", isRead: false, link: "/student/assignments", createdAt: "2026-07-20T09:00:00Z" },
          { id: "4", title: "Payment Confirmed", message: "Your payment of $49.99 has been processed.", type: "PAYMENT", isRead: true, link: null, createdAt: "2026-07-19T11:00:00Z" },
          { id: "5", title: "Welcome!", message: "Welcome to YK Academy. Start your learning journey today.", type: "SYSTEM", isRead: true, link: null, createdAt: "2026-07-15T08:00:00Z" },
          { id: "6", title: "Course Completed", message: "Congratulations! You completed CSS Fundamentals.", type: "SUCCESS", isRead: true, link: "/student/certificates", createdAt: "2026-07-10T16:00:00Z" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const filtered = useMemo(() => {
    if (filterType === "all") return notifications;
    return notifications.filter((n) => n.type === filterType);
  }, [notifications, filterType]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/student/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch(`/api/student/notifications/${id}/read`, { method: "POST" });
    } catch {}
  };

  const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    INFO: { icon: <Info className="h-4 w-4" />, color: "text-blue-500 bg-blue-50" },
    SUCCESS: { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500 bg-emerald-50" },
    WARNING: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-amber-500 bg-amber-50" },
    ERROR: { icon: <XCircle className="h-4 w-4" />, color: "text-red-500 bg-red-50" },
    COURSE: { icon: <GraduationCap className="h-4 w-4" />, color: "text-purple-500 bg-purple-50" },
    ASSIGNMENT: { icon: <Info className="h-4 w-4" />, color: "text-orange-500 bg-orange-50" },
    PAYMENT: { icon: <CreditCard className="h-4 w-4" />, color: "text-emerald-500 bg-emerald-50" },
    SYSTEM: { icon: <Bell className="h-4 w-4" />, color: "text-gray-500 bg-gray-50" },
  };

  const timeAgo = (date: string) => {
    const diff = nowRef - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Notifications" }]}
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="mr-1 h-4 w-4" />
              Mark All Read
            </Button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-3">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.keys(typeConfig).map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((notification, i) => {
            const config = typeConfig[notification.type] ?? typeConfig.INFO;
            const notifClassName = cn(
              "flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-sm",
              notification.isRead
                ? "border-light-gray bg-white"
                : "border-electric-blue/20 bg-electric-blue/5"
            );

            const content = (
              <>
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.color)}>
                  {config.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn("text-sm", notification.isRead ? "font-medium text-navy/70" : "font-semibold text-navy")}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-electric-blue" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-navy/60">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</p>
                </div>
              </>
            );

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {notification.link ? (
                  <Link
                    href={notification.link}
                    onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                    className={notifClassName}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                    className={notifClassName}
                  >
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
