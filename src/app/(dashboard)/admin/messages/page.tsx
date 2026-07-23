"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Inbox, Reply, Archive, Trash2, Star, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<MessageItem | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [replying, setReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    fetch(`/api/admin/messages?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMessages(data.data);
      })
      .catch(() => { toast({ title: "Error", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, statusFilter, toast, refreshKey]);

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "READ" } : m)));
    } catch {}
  };

  const archiveMessage = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARCHIVED" }),
      });
      toast({ title: "Archived" });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      if (selected?.id === id) setSelected(null);
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setReplying(true);
    try {
      await fetch(`/api/admin/messages/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });
      toast({ title: "Sent", description: "Reply sent successfully" });
      setReplyText("");
      setReplying(false);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  const statusColors: Record<string, string> = {
    UNREAD: "bg-electric-blue/10 text-electric-blue",
    READ: "bg-emerald-50 text-emerald-700",
    REPLIED: "bg-violet-50 text-violet-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Messages"
          subtitle={`${unreadCount} unread`}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Messages" }]}
        />

        <div className="flex gap-6">
          <div className="w-full max-w-sm shrink-0">
            <div className="mb-4 flex gap-2">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="mb-4 flex gap-1">
              {["all", "UNREAD", "READ", "ARCHIVED"].map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className={cn(statusFilter === s && "bg-electric-blue text-white")}
                >
                  {s === "all" ? "All" : s}
                </Button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-light-gray" />)}</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => { setSelected(msg); if (msg.status === "UNREAD") markRead(msg.id); }}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition-all",
                      selected?.id === msg.id ? "border-electric-blue bg-electric-blue/5" : "border-light-gray hover:border-electric-blue/30",
                      msg.status === "UNREAD" && "ring-1 ring-electric-blue/20"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm font-medium text-navy truncate", msg.status === "UNREAD" && "font-bold")}>
                          {msg.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{msg.subject || "No subject"}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                    </div>
                  </button>
                ))}
                {messages.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    <Inbox className="mx-auto mb-2 h-8 w-8" />
                    No messages
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1">
            {selected ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-navy">{selected.subject || "No Subject"}</h2>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium text-navy">{selected.name}</span>
                      <span>{selected.email}</span>
                      {selected.phone && <span>{selected.phone}</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(selected.createdAt)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => archiveMessage(selected.id)} className="gap-1">
                      <Archive className="h-3.5 w-3.5" /> Archive
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteMessage(selected.id)} className="gap-1 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-light-gray/30 p-4 text-sm text-navy/80 leading-relaxed">
                  {selected.message}
                </div>

                <div className="mt-6 border-t border-light-gray pt-4">
                  <Label>Reply</Label>
                  <Textarea
                    rows={4}
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="mt-2"
                  />
                  <Button
                    onClick={handleReply}
                    disabled={replying || !replyText.trim()}
                    className="mt-3 gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white"
                  >
                    <Reply className="h-4 w-4" />
                    {replying ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-light-gray text-muted-foreground">
                <div className="text-center">
                  <Inbox className="mx-auto h-12 w-12" />
                  <p className="mt-3 text-sm">Select a message to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
