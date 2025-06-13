/* ─────────────────────────────────────────────────────────────
 *  src/pages/admin/AdminSettingsPage.jsx
 *  Admin-only global settings (General / Notifications / Security / Plans / Payment Gateway)
 *  • Fixes duplicate-plan issue by persisting _id from Mongo
 *  • Adds plan deletion with backend API call
 *  • Updates form validation for plans to be more permissive
 *  • Integrates backend for General, Notifications, Maintenance settings
 *  • Adds Payment Gateway tab for managing payment provider settings
 *  • Enforces valid limit on enable and highlights duplicates
 *  • Fixes TypeScript syntax errors in togglePlanEnabled
 * ───────────────────────────────────────────────────────────── */

import { Bell, CreditCard, Loader2, Palette, Plus, Save, ShieldCheck, Trash2, Key, Globe, History } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMaintenance } from "@/contexts/MaintenanceContext";

import {
  bulkUpdatePlans,
  createPlan,
  fetchGeneralSettings,
  fetchMaintenanceSettings,
  fetchNotificationSettings,
  fetchPaymentSettings,
  fetchPlans,
  saveGeneralSettings,
  saveMaintenanceSettings,
  saveNotificationSettings,
  savePaymentSettings,
  fetchSecuritySettings,
  saveSecuritySettings
} from "@/services/api";

// ─────────────────────────────────────────────────────────────
//  Helpers – Mongo ⇆ UI mapping
// ─────────────────────────────────────────────────────────────
const mapBackToUi = (p) => ({
  id: p.id || p._id,
  _id: p.id || p._id,
  name: p.name || "",
  description: p.description ?? "",
  price: p.price ?? null,
  limit: p.rate_limit ?? 0,
  dailyLimit: p.daily_limit ?? null,
  enabled: p.rate_limit !== null,
  features: p.features ?? [],
  isPopular: p.is_popular ?? false,
  cta: p.cta ?? ""
});
const mapUiToBack = (p) => {
  const payload = {
    id: p._id ?? undefined,
    name: p.name?.trim() || undefined,
    description: p.description || undefined,
    price: p.price !== null ? Number(p.price) : undefined,
    rate_limit: p.enabled ? Math.max(1, Number(p.limit)) : null,
    daily_limit: p.enabled && p.dailyLimit !== null ? Math.max(0, Number(p.dailyLimit)) : null,
    features: Array.isArray(p.features) ? p.features : [],
    is_popular: !!p.isPopular,
    cta: p.cta || undefined
  };
  return Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));
};

const validatePlans = (plans) => {
  const errors = [];
  const names = new Set();

  for (const plan of plans) {
    if (!plan.name.trim() && !plan.price && !plan.limit && !plan.dailyLimit && !plan.enabled) {
      continue;
    }

    if (!plan.name.trim()) {
      errors.push(`Plan "${plan.name || 'Unnamed'}" must have a non-empty name.`);
    } else if (names.has(plan.name.trim().toLowerCase())) {
      errors.push(`Plan name "${plan.name}" is duplicated (case-insensitive).`);
    } else {
      names.add(plan.name.trim().toLowerCase());
    }

    if (plan.price !== null && (isNaN(plan.price) || plan.price < 0)) {
      errors.push(`Plan "${plan.name}" has an invalid price (must be >= 0).`);
    }

    if (plan.enabled && (isNaN(plan.limit) || plan.limit < 1)) {
      errors.push(`Plan "${plan.name}" must have a valid requests/minute limit (>= 1).`);
    }

    if (plan.enabled && plan.dailyLimit !== null && (isNaN(plan.dailyLimit) || plan.dailyLimit < 0)) {
      errors.push(`Plan "${plan.name}" has an invalid daily limit (>= 0 or null).`);
    }
  }

  return { valid: errors.length === 0, errors };
};

// ─────────────────────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────────────────────
const AdminSettingsPage = () => {
  const { toast } = useToast();
  const { maintenanceMode, updateMaintenanceMode } = useMaintenance();

  /* ─── General / Notifications / Payment Gateway ────────── */
  const [siteName, setSiteName] = useState("StartupCopilot");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [adminEmail, setAdminEmail] = useState("admin@startupcopilot.ai");
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: false,
    stripePublishableKey: "",
    stripeSecretKey: "",
    paypalEnabled: false,
    paypalClientId: "",
    paypalSecret: ""
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  /* ─── Maintenance dialog ─────────────────────────────── */
  const [showDialog, setShowDialog] = useState(false);
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    enabled: maintenanceMode.enabled,
    message: maintenanceMode.message || "We are currently performing scheduled maintenance.",
    endTime: maintenanceMode.endTime
      ? new Date(maintenanceMode.endTime).toISOString().slice(0, 16)
      : "",
    allowAdminAccess: maintenanceMode.allowAdminAccess
  });

  /* ─── Plans ───────────────────────────────────────────── */
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [savingPlans, setSavingPlans] = useState(false);
  const [planErrors, setPlanErrors] = useState([]);

  /* ─── Security Settings State ─────────────────────────────── */
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    ipWhitelistEnabled: false,
    ipWhitelist: [],
    googleAuthEnabled: false,
    googleAuthClientId: "",
    googleAuthClientSecret: "",
    auditTrailEnabled: false,
    auditRetentionDays: 30
  });

  // Fetch settings and plans on mount
  useEffect(() => {
    const loadData = async () => {
      setSettingsLoading(true);
      setPlansLoading(true);
      try {
        const [general, notifications, maintenance, payments, plansData] = await Promise.all([
          fetchGeneralSettings(),
          fetchNotificationSettings(),
          fetchMaintenanceSettings(),
          fetchPaymentSettings(),
          fetchPlans()
        ]);
        setSiteName(general.siteName || "StartupCopilot");
        setAdminEmail(notifications.adminEmail || "admin@startupcopilot.ai");
        setEmailNotifications(notifications.emailNotifications ?? true);
        setMaintenanceSettings({
          enabled: maintenance.enabled ?? false,
          message: maintenance.message || "We are currently performing scheduled maintenance.",
          endTime: maintenance.endTime ? new Date(maintenance.endTime).toISOString().slice(0, 16) : "",
          allowAdminAccess: maintenance.allowAdminAccess ?? false
        });
        setPaymentSettings({
          stripeEnabled: payments.stripeEnabled ?? false,
          stripePublishableKey: payments.stripePublishableKey || "",
          stripeSecretKey: payments.stripeSecretKey || "",
          paypalEnabled: payments.paypalEnabled ?? false,
          paypalClientId: payments.paypalClientId || "",
          paypalSecret: payments.paypalSecret || ""
        });
        const mappedPlans = plansData.map(mapBackToUi);
        setPlans(mappedPlans);
        setPlanErrors(validatePlans(mappedPlans).errors);
      } catch (err) {
        console.error("Error loading settings:", err);
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: err.message || "Could not fetch settings or plans."
        });
      } finally {
        setSettingsLoading(false);
        setPlansLoading(false);
      }
    };
    loadData();
  }, [toast]);

  // Validate plans on change
  useEffect(() => {
    const validation = validatePlans(plans);
    setPlanErrors(validation.errors);
  }, [plans]);

  // Add this near other useEffect hooks
  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        const settings = await fetchSecuritySettings();
        setSecuritySettings(settings);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to load security settings",
          description: err.message || "Could not fetch security settings."
        });
      }
    };
    loadSecuritySettings();
  }, []);

  /* ─── Local helpers ───────────────────────────────────── */
  const updatePlanField = (planId, field, value) => {

    setPlans(prev => prev.map(p => (p.id === planId ? { ...p, [field]: value } : p)));
  };

const togglePlanEnabled = (planId, enabled) => {
    setPlans(prev =>
      prev.map(p =>
        p.id === planId
          ? {
              ...p,
              enabled,
              limit: enabled ? (p.limit < 1 ? 100 : p.limit) : 0
            }
          : p
      )
    );
  };

  const addPlan = () => {
    setPlans(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        _id: null,
        name: "",
        description: "",
        price: null,
        limit: 100, // Default to valid limit
        dailyLimit: null,
        enabled: false,
        features: [],
        isPopular: false,
        cta: ""
      }
    ]);
  };

const deletePlan = async (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (plan._id) {
      try {
        await deletePlan(plan._id);
        toast({
          title: "Plan deleted",
          description: `Plan "${plan.name}" was deleted successfully.`
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error deleting plan",
          description: err.message || "Failed to delete plan."
        });
        return;
      }
    }
    setPlans(prev => prev.filter(p => p.id !== planId));
  };

  /* ─── Save handler ────────────────────────────────────── */
const handleSaveChanges = async (section) => {
  try {
    if (section === "General") {
      await saveGeneralSettings({ siteName });
      toast({
        title: "General Settings Saved",
        description: "General settings have been updated.",
      });
    } else if (section === "Notification") {
      await saveNotificationSettings({ adminEmail, emailNotifications });
      toast({
        title: "Notification Settings Saved",
        description: "Notification settings have been updated.",
      });
    } else if (section === "Plan") {
      const validation = validatePlans(plans);
      if (!validation.valid) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: validation.errors.join(" "),
        });
        return;
      }

      setSavingPlans(true);
      const newPlans = plans.filter((p) => !p._id && p.name.trim());
      const existingPlans = plans.filter((p) => p._id);

      const createdPlans = [];
      for (const plan of newPlans) {
        const payload = mapUiToBack(plan);
        delete payload.id;
        const created = await createPlan(payload);
        createdPlans.push(created);
      }

      const updatePayload = existingPlans.map(mapUiToBack);
      const updatedPlans = updatePayload.length
        ? await bulkUpdatePlans(updatePayload)
        : [];

      setPlans([...createdPlans, ...updatedPlans].map(mapBackToUi));
      toast({
        title: "Plan settings updated",
        description: "All changes saved.",
      });
    } else if (section === "Payment") {
      await savePaymentSettings(paymentSettings);
      toast({
        title: "Payment Gateway Settings Saved",
        description: "Payment gateway settings have been updated.",
      });
    } else if (section === "Security") {
      await saveSecuritySettings(securitySettings);
      toast({
        title: "Security Settings Saved",
        description: "Security settings have been updated successfully.",
      });
    }
  } catch (err) {
    toast({
      variant: "destructive",
      title: `Error saving ${section.toLowerCase()} settings`,
      description: err.message || `Failed to save ${section.toLowerCase()} settings.`,
    });
  } finally {
    if (section === "Plan") setSavingPlans(false);
  }
};


  /* ─── Maintenance toggles ─────────────────────────────── */
  const handleMaintenanceToggle = () => {
    if (!maintenanceSettings.enabled) setShowDialog(true);
    else {
      const settings = { ...maintenanceSettings, enabled: false };
      updateMaintenanceMode(settings);
      saveMaintenanceSettings(settings).catch(err =>
        toast({
          variant: "destructive",
          title: "Error disabling maintenance",
          description: err.message || "Failed to disable maintenance mode."
        })
      );
    }
  };

  const handleMaintenanceSubmit = async () => {
    try {
      const settings = {
        ...maintenanceSettings,
        endTime: maintenanceSettings.endTime ? new Date(maintenanceSettings.endTime).toISOString() : null
      };
      await saveMaintenanceSettings(settings);
      updateMaintenanceMode(settings);
      setShowDialog(false);
      toast({
        title: "Maintenance Mode Updated",
        description: "Maintenance settings have been saved."
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error saving maintenance settings",
        description: err.message || "Failed to save maintenance settings."
      });
    }
  };

  /* ─── JSX ──────────────────────────────────────────────── */
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap gap-2 max-w-full">
          <TabsTrigger value="general"><Palette className="mr-1 h-4 w-4 md:hidden" />General</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1 h-4 w-4 md:hidden" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><ShieldCheck className="mr-1 h-4 w-4 md:hidden" />Security</TabsTrigger>
          <TabsTrigger value="plans"><ShieldCheck className="mr-1 h-4 w-4 md:hidden" />Plans</TabsTrigger>
          <TabsTrigger value="payment"><CreditCard className="mr-1 h-4 w-4 md:hidden" />Payment Gateway</TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic site configurations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <Label className="font-medium" htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-xs text-muted-foreground">Temporarily disable public access.</p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={maintenanceMode.enabled}
                      onCheckedChange={handleMaintenanceToggle}
                    />
                  </div>

                  <div className={maintenanceMode.enabled ? "text-orange-500" : "text-green-500"}>
                    Status: {maintenanceMode.enabled ? "Maintenance Mode Active" : "System Online"}
                  </div>
                  {maintenanceMode.enabled && maintenanceMode.endTime && (
                    <div className="text-muted-foreground">
                      Scheduled End: {new Date(maintenanceMode.endTime).toLocaleString()}
                    </div>
                  )}

                  <Button onClick={() => handleSaveChanges("General")} disabled={settingsLoading}>
                    <Save className="mr-2 h-4 w-4" />Save General Settings
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Admin notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <Label className="font-medium" htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">System alerts will be sent to this email.</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Button onClick={() => handleSaveChanges("Notification")} disabled={settingsLoading}>
                    <Save className="mr-2 h-4 w-4" />Save Notification Settings
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure access control and protection settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Key className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="font-medium">Two-Factor Authentication (2FA)</Label>
                      <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts.</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))
                    }
                  />
                </div>
              </div>

              {/* IP Whitelisting */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="font-medium">IP Whitelisting</Label>
                      <p className="text-xs text-muted-foreground">Restrict access to specific IP addresses.</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelistEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings(prev => ({ ...prev, ipWhitelistEnabled: checked }))
                    }
                  />
                </div>
                {securitySettings.ipWhitelistEnabled && (
                  <div className="space-y-2">
                    <Label>Whitelisted IP Addresses</Label>
                    <Textarea
                      placeholder="Enter IP addresses (one per line)"
                      value={(securitySettings.ipWhitelist || []).join('\n')}
                      onChange={(e) =>
                        setSecuritySettings(prev => ({
                          ...prev,
                          ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: IPv4 or IPv6, one per line. Example: 192.168.1.1
                    </p>
                  </div>
                )}
              </div>

              {/* Google Auth */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="font-medium">Google Authentication</Label>
                      <p className="text-xs text-muted-foreground">Enable Google OAuth 2.0 login.</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.googleAuthEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings(prev => ({ ...prev, googleAuthEnabled: checked }))
                    }
                  />
                </div>
                {securitySettings.googleAuthEnabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="google-client-id">Google Client ID</Label>
                      <Input
                        id="google-client-id"
                        type="password"
                        value={securitySettings.googleAuthClientId}
                        onChange={(e) =>
                          setSecuritySettings(prev => ({
                            ...prev,
                            googleAuthClientId: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google-client-secret">Google Client Secret</Label>
                      <Input
                        id="google-client-secret"
                        type="password"
                        value={securitySettings.googleAuthClientSecret}
                        onChange={(e) =>
                          setSecuritySettings(prev => ({
                            ...prev,
                            googleAuthClientSecret: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <p className="text-sm font-medium">Setup Instructions:</p>
                      <ol className="text-sm text-muted-foreground list-decimal pl-4 space-y-1 mt-2">
                        <li>Go to Google Cloud Console</li>
                        <li>Create a new project or select existing one</li>
                        <li>Enable OAuth 2.0 API</li>
                        <li>Configure OAuth consent screen</li>
                        <li>Create OAuth 2.0 credentials</li>
                        <li>Add authorized redirect URIs</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              {/* Audit Trail */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <History className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="font-medium">Audit Trail</Label>
                      <p className="text-xs text-muted-foreground">Track and log all admin actions.</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.auditTrailEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings(prev => ({ ...prev, auditTrailEnabled: checked }))
                    }
                  />
                </div>
                {securitySettings.auditTrailEnabled && (
                  <div className="space-y-2">
                    <Label>Audit Log Retention (Days)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      value={securitySettings.auditRetentionDays}
                      onChange={(e) =>
                        setSecuritySettings(prev => ({
                          ...prev,
                          auditRetentionDays: Math.max(1, Math.min(365, Number(e.target.value)))
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Specify how long to keep audit logs (1-365 days)
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => handleSaveChanges("Security")} 
                disabled={settingsLoading}
              >
                <Save className="mr-2 h-4 w-4" />Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLANS */}
        <TabsContent value="plans" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Plans</CardTitle>
                <CardDescription>Set pricing and rate-limit caps for each tier.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addPlan}>
                <Plus className="mr-1 h-4 w-4" />Add Plan
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {plansLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  {planErrors.length > 0 && (
                    <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
                      <p className="font-medium">Validation Errors:</p>
                      <ul className="list-disc pl-5">
                        {planErrors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(p => (
                      <div
                        key={p.id}
                        className={`space-y-3 rounded-lg border bg-background p-4 ${
                          new Set(plans.map(p => p.name.trim().toLowerCase())).size !== plans.length &&
                          plans.filter(x => x.name.trim().toLowerCase() === p.name.trim().toLowerCase()).length > 1
                            ? 'border-destructive'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Input
                            placeholder="Plan Name"
                            value={p.name}
                            onChange={e => updatePlanField(p.id, "name", e.target.value)}
                            className={
                              new Set(plans.map(p => p.name.trim().toLowerCase())).size !== plans.length &&
                              plans.filter(x => x.name.trim().toLowerCase() === p.name.trim().toLowerCase()).length > 1
                                ? 'border-destructive'
                                : ''
                            }
                          />
                          <div className="flex items-center space-x-2">
                            <Switch checked={p.enabled} onCheckedChange={v => togglePlanEnabled(p.id, v)} />
                            <Trash2
                              className="cursor-pointer text-destructive"
                              onClick={() => deletePlan(p.id)}
                            />
                          </div>
                        </div>

                        <Input
                          placeholder="Description"
                          value={p.description}
                          onChange={e => updatePlanField(p.id, "description", e.target.value)}
                        />

                        <div className="space-y-2">
                          <Label>Requests / Minute</Label>
                          <Input
                            type="number"
                            min="1"
                            disabled={!p.enabled}
                            value={p.limit}
                            onChange={e => updatePlanField(p.id, "limit", Math.max(1, Number(e.target.value)))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Daily Limit (0 = unlimited)</Label>
                          <Input
                            type="number"
                            min="0"
                            disabled={!p.enabled}
                            value={p.dailyLimit ?? 0}
                            onChange={e =>
                              updatePlanField(p.id, "dailyLimit", Number(e.target.value) || null)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Price (USD)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={p.price ?? ""}
                            onChange={e =>
                              updatePlanField(p.id, "price", e.target.value === "" ? null : Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>CTA Label</Label>
                          <Input
                            placeholder="e.g. Upgrade now"
                            value={p.cta}
                            onChange={e => updatePlanField(p.id, "cta", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Features (comma-separated)</Label>
                          <Input
                            placeholder="Unlimited API, Priority support"
                            value={p.features.join(", ")}
                            onChange={e =>
                              updatePlanField(
                                p.id,
                                "features",
                                e.target.value
                                  .split(",")
                                  .map(f => f.trim())
                                  .filter(Boolean)
                              )
                            }
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={p.isPopular}
                            onCheckedChange={v => updatePlanField(p.id, "isPopular", v)}
                          />
                          <span className="text-sm">Mark as "Popular"</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSaveChanges("Plan")}
                    disabled={savingPlans || plansLoading}
                  >
                    {savingPlans && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Plan Settings
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYMENT GATEWAY */}
        <TabsContent value="payment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Settings</CardTitle>
              <CardDescription>Configure payment providers for processing transactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div>
                        <Label className="font-medium" htmlFor="stripe-enabled">Enable Stripe</Label>
                        <p className="text-xs text-muted-foreground">Process payments via Stripe.</p>
                      </div>
                      <Switch
                        id="stripe-enabled"
                        checked={paymentSettings.stripeEnabled}
                        onCheckedChange={v => setPaymentSettings(prev => ({ ...prev, stripeEnabled: v }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe-publishable-key">Stripe Publishable Key</Label>
                      <Input
                        id="stripe-publishable-key"
                        type="password"
                        value={paymentSettings.stripePublishableKey}
                        onChange={e =>
                          setPaymentSettings(prev => ({ ...prev, stripePublishableKey: e.target.value }))
                        }
                        disabled={!paymentSettings.stripeEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                      <Input
                        id="stripe-secret-key"
                        type="password"
                        value={paymentSettings.stripeSecretKey}
                        onChange={e =>
                          setPaymentSettings(prev => ({ ...prev, stripeSecretKey: e.target.value }))
                        }
                        disabled={!paymentSettings.stripeEnabled}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div>
                        <Label className="font-medium" htmlFor="paypal-enabled">Enable PayPal</Label>
                        <p className="text-xs text-muted-foreground">Process payments via PayPal.</p>
                      </div>
                      <Switch
                        id="paypal-enabled"
                        checked={paymentSettings.paypalEnabled}
                        onCheckedChange={v => setPaymentSettings(prev => ({ ...prev, paypalEnabled: v }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                      <Input
                        id="paypal-client-id"
                        type="password"
                        value={paymentSettings.paypalClientId}
                        onChange={e =>
                          setPaymentSettings(prev => ({ ...prev, paypalClientId: e.target.value }))
                        }
                        disabled={!paymentSettings.paypalEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypal-secret">PayPal Secret</Label>
                      <Input
                        id="paypal-secret"
                        type="password"
                        value={paymentSettings.paypalSecret}
                        onChange={e =>
                          setPaymentSettings(prev => ({ ...prev, paypalSecret: e.target.value }))
                        }
                        disabled={!paymentSettings.paypalEnabled}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSaveChanges("Payment")} disabled={settingsLoading}>
                    <Save className="mr-2 h-4 w-4" />Save Payment Gateway Settings
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Maintenance Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Maintenance Mode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Maintenance Message</Label>
              <Textarea
                value={maintenanceSettings.message}
                onChange={e =>
                  setMaintenanceSettings(prev => ({ ...prev, message: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Time (optional)</Label>
              <Input
                type="datetime-local"
                value={maintenanceSettings.endTime}
                onChange={e =>
                  setMaintenanceSettings(prev => ({ ...prev, endTime: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="adminAccess"
                checked={maintenanceSettings.allowAdminAccess}
                onCheckedChange={chk =>
                  setMaintenanceSettings(prev => ({ ...prev, allowAdminAccess: chk }))
                }
              />
              <Label htmlFor="adminAccess">Allow admins access during maintenance</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleMaintenanceSubmit}>Enable Maintenance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSettingsPage;