"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, User, Mail, Phone, FileText, Lock, Shield, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

export default function StudentProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
  });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/student/profile");
        if (res.ok) {
          const json = await res.json();
          setProfile(json.data);
          setTwoFactorEnabled(json.data.twoFactorEnabled ?? false);
        }
      } catch {
        setProfile({ name: "Student User", email: "student@ykacademy.com", phone: "", bio: "", image: "" });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        toast({ title: "Profile updated", description: "Your profile has been saved." });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      toast({ title: "Error", description: "Passwords don't match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/student/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: password.current, newPassword: password.new }),
      });
      if (res.ok) {
        toast({ title: "Password changed", description: "Your password has been updated." });
        setPassword({ current: "", new: "", confirm: "" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to change password.", variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggle2FA = async (checked: boolean) => {
    setTwoFactorEnabled(checked);
    try {
      await fetch("/api/student/profile/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: checked }),
      });
    } catch {
      setTwoFactorEnabled(!checked);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information and settings"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Profile" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.image} alt={profile.name} />
                  <AvatarFallback className="text-2xl">
                    {profile.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "S"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-electric-blue text-white shadow-md transition-colors hover:bg-electric-blue/90"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium text-navy">Student</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">2FA:</span>
                <span className={`font-medium ${twoFactorEnabled ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-navy">Personal Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-navy">Change Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={password.new}
                    onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                  Update Password
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-navy">Security</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-navy">Connected Accounts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-light-gray p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-light-gray">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">Google</p>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-light-gray p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-light-gray">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">GitHub</p>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-navy">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email updates about your courses</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy">Course Reminders</p>
                  <p className="text-xs text-muted-foreground">Get reminded about incomplete lessons</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy">Marketing Emails</p>
                  <p className="text-xs text-muted-foreground">Receive updates about new courses</p>
                </div>
                <Switch />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
