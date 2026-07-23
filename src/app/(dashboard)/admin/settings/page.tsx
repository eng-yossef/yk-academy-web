"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Save, Globe, Palette, Mail, Search, Share2, CreditCard } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  stripeKey: string;
  stripeSecret: string;
  currency: string;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Settings>({
    siteName: "YK Academy",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    logo: "",
    primaryColor: "#1976FF",
    secondaryColor: "#00C2FF",
    fontFamily: "Inter",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    stripeKey: "",
    stripeSecret: "",
    currency: "SAR",
    maintenanceMode: false,
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("general");
  const { toast } = useToast();

  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Saved", description: "Settings updated" });
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof Settings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-light-gray" />)}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Settings"
          subtitle="Configure your site"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
          actions={
            <Button onClick={handleSave} disabled={saving} className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="general" className="gap-2"><Globe className="h-4 w-4" /> General</TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /> Appearance</TabsTrigger>
            <TabsTrigger value="email" className="gap-2"><Mail className="h-4 w-4" /> Email</TabsTrigger>
            <TabsTrigger value="seo" className="gap-2"><Search className="h-4 w-4" /> SEO</TabsTrigger>
            <TabsTrigger value="social" className="gap-2"><Share2 className="h-4 w-4" /> Social</TabsTrigger>
            <TabsTrigger value="payment" className="gap-2"><CreditCard className="h-4 w-4" /> Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">General Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Site Name</Label><Input value={settings.siteName} onChange={(e) => updateField("siteName", e.target.value)} /></div>
                <div className="space-y-2"><Label>Logo URL</Label><Input value={settings.logo} onChange={(e) => updateField("logo", e.target.value)} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea rows={2} value={settings.siteDescription} onChange={(e) => updateField("siteDescription", e.target.value)} /></div>
                <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={settings.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={settings.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={settings.address} onChange={(e) => updateField("address", e.target.value)} /></div>
                <div className="space-y-2"><Label>Currency</Label><Input value={settings.currency} onChange={(e) => updateField("currency", e.target.value)} /></div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => updateField("maintenanceMode", v)} />
                <Label>Maintenance Mode</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Appearance</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={settings.primaryColor} onChange={(e) => updateField("primaryColor", e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border border-light-gray" />
                    <Input value={settings.primaryColor} onChange={(e) => updateField("primaryColor", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={settings.secondaryColor} onChange={(e) => updateField("secondaryColor", e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border border-light-gray" />
                    <Input value={settings.secondaryColor} onChange={(e) => updateField("secondaryColor", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2"><Label>Font Family</Label><Input value={settings.fontFamily} onChange={(e) => updateField("fontFamily", e.target.value)} /></div>
              </div>
              <div className="mt-6">
                <Label>Preview</Label>
                <div className="mt-2 flex gap-3">
                  <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: settings.primaryColor }} />
                  <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: settings.secondaryColor }} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">SMTP Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>SMTP Host</Label><Input value={settings.smtpHost} onChange={(e) => updateField("smtpHost", e.target.value)} /></div>
                <div className="space-y-2"><Label>SMTP Port</Label><Input value={settings.smtpPort} onChange={(e) => updateField("smtpPort", e.target.value)} /></div>
                <div className="space-y-2"><Label>Username</Label><Input value={settings.smtpUser} onChange={(e) => updateField("smtpUser", e.target.value)} /></div>
                <div className="space-y-2"><Label>Password</Label><Input type="password" value={settings.smtpPass} onChange={(e) => updateField("smtpPass", e.target.value)} /></div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">SEO Defaults</h3>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Default Meta Title</Label><Input value={settings.metaTitle} onChange={(e) => updateField("metaTitle", e.target.value)} /></div>
                <div className="space-y-2"><Label>Default Meta Description</Label><Textarea rows={2} value={settings.metaDescription} onChange={(e) => updateField("metaDescription", e.target.value)} /></div>
                <div className="space-y-2"><Label>Keywords (comma separated)</Label><Input value={settings.metaKeywords} onChange={(e) => updateField("metaKeywords", e.target.value)} /></div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Social Media Links</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(["facebook", "twitter", "instagram", "youtube", "linkedin"] as const).map((platform) => (
                  <div key={platform} className="space-y-2">
                    <Label className="capitalize">{platform}</Label>
                    <Input placeholder={`https://${platform}.com/...`} value={settings[platform]} onChange={(e) => updateField(platform, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Payment Gateway</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Stripe Public Key</Label><Input value={settings.stripeKey} onChange={(e) => updateField("stripeKey", e.target.value)} /></div>
                <div className="space-y-2"><Label>Stripe Secret Key</Label><Input type="password" value={settings.stripeSecret} onChange={(e) => updateField("stripeSecret", e.target.value)} /></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
