"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Mail,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
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
import { Switch } from "@/components/ui/switch";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  phone: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState<UserItem | null>(null);
  const [newUser, setNewUser] = React.useState({ name: "", email: "", role: "STUDENT", password: "" });
  const [creating, setCreating] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter !== "all") params.set("role", roleFilter);
    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUsers(data.data);
      })
      .catch(() => { toast({ title: "Error", description: "Failed to load users", variant: "destructive" }); })
      .finally(() => setLoading(false));
  }, [search, roleFilter, toast, refreshKey]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Created", description: "User created successfully" });
        setCreateOpen(false);
        setNewUser({ name: "", email: "", role: "STUDENT", password: "" });
        setRefreshKey((k) => k + 1);
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editUser) return;
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editUser.role, isActive: editUser.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Updated", description: "User updated" });
        setEditUser(null);
        setRefreshKey((k) => k + 1);
      }
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleToggleActive = async (user: UserItem) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: user.isActive ? "Deactivated" : "Activated", description: `${user.name} has been ${user.isActive ? "deactivated" : "activated"}` });
        setRefreshKey((k) => k + 1);
      }
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Deleted", description: "User deleted" });
        setRefreshKey((k) => k + 1);
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-rose-50 text-rose-700",
    ADMIN: "bg-amber-50 text-amber-700",
    INSTRUCTOR: "bg-violet-50 text-violet-700",
    STUDENT: "bg-electric-blue/10 text-electric-blue",
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Users"
          subtitle="Manage all users and roles"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
          actions={
            <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          }
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search users..." value={search} onChange={setSearch} className="w-full sm:w-72" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-light-gray" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon={<UsersIcon />} title="No users found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-light-gray transition-colors hover:bg-light-gray/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-navy">{user.name}</p>
                      {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-navy/70">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-medium", roleColors[user.role])}>
                      {user.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(user)}>
                        {user.isActive ? <ShieldOff className="h-4 w-4 text-amber-500" /> : <Shield className="h-4 w-4 text-emerald-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>Add a new user to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={creating} className="bg-gradient-to-r from-electric-blue to-cyan text-white">
                {creating ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update role or status for {editUser?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editUser?.role || ""} onValueChange={(v) => editUser && setEditUser({ ...editUser, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editUser?.isActive ?? true} onCheckedChange={(v) => editUser && setEditUser({ ...editUser, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button onClick={handleUpdateRole} className="bg-gradient-to-r from-electric-blue to-cyan text-white">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Delete User"
          message="This will permanently delete the user and all their data."
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={handleDelete}
          loading={deleting}
        />
      </motion.div>
    </DashboardLayout>
  );
}

function UsersIcon() {
  return <Mail className="h-8 w-8" />;
}
