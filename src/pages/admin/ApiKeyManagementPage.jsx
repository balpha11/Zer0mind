import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Key,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";

import { createApiKey, deleteApiKey, fetchApiKeys } from "@/services/api";

/* ------------------------------------------------------------
 *  Plan presets – could come from backend
 * ---------------------------------------------------------- */
const PLAN_PRESETS = [
  { id: "founder", name: "Founder Fuel Free" },
  { id: "scaleup", name: "Scale-Up Pro" },
  { id: "enterprise", name: "Enterprise Engine" }
];

const getPlanName = (id) => PLAN_PRESETS.find((p) => p.id === id)?.name ?? id;

const ApiKeyManagementPage = () => {
  /* ────────────── Local state ────────────── */
  const [apiKeys, setApiKeys] = useState([]);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [showKeys, setShowKeys] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [newKeyForm, setNewKeyForm] = useState({
    name: "",
    key: "",
    model: "gpt-4",
    rateLimitEnabled: false,
    planId: "founder"
  });

  /* ────────────── Fetch existing keys ────────────── */
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchApiKeys();
        setApiKeys(data);
      } catch {
        toast({ variant: "destructive", title: "Error", description: "Failed to load API keys." });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* ────────────── Handlers ────────────── */
  const handleNewKeySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: newKeyForm.name,
        key: newKeyForm.key,
        model: newKeyForm.model,
        rate_limit_enabled: newKeyForm.rateLimitEnabled,
        plan_id: newKeyForm.rateLimitEnabled ? newKeyForm.planId : null
      };
      const created = await createApiKey(payload);
      setApiKeys([...apiKeys, created]);
      setShowNewKeyDialog(false);
      resetForm();
      toast({ title: "Success", description: "API key created." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to create API key." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () =>
    setNewKeyForm({ name: "", key: "", model: "gpt-4", rateLimitEnabled: false, planId: "founder" });

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteApiKey(id);
      setApiKeys(apiKeys.filter((k) => k.id !== id));
      toast({ title: "Deleted", description: "API key deleted." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete API key." });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setKeyToDelete(null);
    }
  };

  const toggleKeyVisibility = (id) => setShowKeys((p) => ({ ...p, [id]: !p[id] }));
  const toggleKeyStatus = (id) => {
    setApiKeys(apiKeys.map((k) => (k.id === id ? { ...k, isActive: !k.isActive } : k)));
    toast({ title: "Updated", description: "Key status changed." });
  };

  const copyToClipboard = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      toast({ title: "Copied", description: "Key copied." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to copy." });
    }
  };

  /* ────────────── Filtered list ────────────── */
  const filteredKeys = apiKeys.filter(
    (k) => k.name.toLowerCase().includes(search.toLowerCase()) || k.model.toLowerCase().includes(search.toLowerCase())
  );

  /* ────────────── Render ────────────── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
          <p className="mt-2 text-muted-foreground">Create keys & assign plans</p>
        </div>
        {/* ➕ New key dialog trigger */}
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New API Key</Button>
          </DialogTrigger>

          {/* ────────────── New Key Dialog */}
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Select a plan if rate limiting is enabled.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleNewKeySubmit}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Key Name</Label>
                  <Input required value={newKeyForm.name} onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })} />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input required value={newKeyForm.key} onChange={(e) => setNewKeyForm({ ...newKeyForm, key: e.target.value })} />
                </div>
                <div>
                  <Label>Model</Label>
                  <Select value={newKeyForm.model} onValueChange={(v) => setNewKeyForm({ ...newKeyForm, model: v })}>
                    <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rate-limit toggle */}
                <div className="flex items-center space-x-2">
                  <Switch checked={newKeyForm.rateLimitEnabled} onCheckedChange={(chk) => setNewKeyForm({ ...newKeyForm, rateLimitEnabled: chk })} />
                  <Label>Enable Rate Limiting</Label>
                </div>

                {/* Plan select only */}
                {newKeyForm.rateLimitEnabled && (
                  <div>
                    <Label>Plan</Label>
                    <Select value={newKeyForm.planId} onValueChange={(planId) => setNewKeyForm({ ...newKeyForm, planId })}>
                      <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                      <SelectContent>
                        {PLAN_PRESETS.map((p) => (
                          <SelectItem value={p.id} key={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Creating…</> : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔍 Search */}
      <Card><CardContent className="p-4"><div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" /></div></CardContent></Card>

      {/* Key list */}
      <Card>
        <CardHeader><CardTitle>API Keys</CardTitle><CardDescription>{filteredKeys.length} {filteredKeys.length === 1 ? "key" : "keys"}</CardDescription></CardHeader>
        <CardContent>
          {isLoading && !filteredKeys.length ? (
            <div className="flex flex-col items-center py-8"><RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">Loading…</p></div>
          ) : filteredKeys.length === 0 ? (
            <div className="flex flex-col items-center py-8"><Key className="h-8 w-8 text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">No keys found.</p></div>
          ) : (
            <div className="grid gap-4">
              {filteredKeys.map((k) => (
                <Card key={k.id}><CardContent className="p-6 flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      <h4 className="font-medium max-w-[150px] truncate" title={k.name}>{k.name}</h4>
                      <Badge variant={k.isActive ? "default" : "secondary"}>{k.isActive ? "Active" : "Inactive"}</Badge>
                      <Badge variant="outline">{k.model}</Badge>
                      {k.rateLimitEnabled && (<Badge variant="outline">{getPlanName(k.planId)}</Badge>)}
                    </div>

                    <div className="flex items-center space-x-2">
                      <code className="bg-muted rounded px-2 py-1 font-mono text-sm">{showKeys[k.id] ? k.key : "••••••••••••••••"}</code>
                      <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(k.id)}>{showKeys[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(k.key)}><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleKeyStatus(k.id)}><Power className={`h-4 w-4 ${k.isActive ? "text-green-500" : "text-gray-400"}`} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setKeyToDelete(k); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><DialogContent><DialogHeader><DialogTitle>Delete API Key</DialogTitle></DialogHeader><Alert variant="destructive" className="my-4"><AlertCircle className="h-4 w-4" /><AlertDescription>Delete “{keyToDelete?.name}”?</AlertDescription></Alert><DialogFooter><Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setKeyToDelete(null); }}>Cancel</Button><Button variant="destructive" onClick={() => handleDelete(keyToDelete?.id)} disabled={isLoading}>{isLoading ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Deleting…</> : "Delete"}</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
};

export default ApiKeyManagementPage;