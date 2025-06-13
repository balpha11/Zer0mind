// src/pages/admin/GuardrailsPage.jsx
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  AlertCircle,
  Eye,
  EyeOff,
  LayoutGrid,
  LayoutList,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import {
  createGuardrail,
  deleteGuardrail,
  fetchGuardrails,
  updateGuardrail,
} from '@/services/api';

const GuardrailsPage = () => {
  /* ────────────────────────────────────────────────────────────
     Local state
  ──────────────────────────────────────────────────────────── */
  const [guardrails, setGuardrails] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [guardrailToDelete, setGuardrailToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const blankForm = {
    name: '',
    type: 'Input',
    description: '',
    logic: '',
    active: true,
  };
  const [form, setForm] = useState(blankForm);

  /* ────────────────────────────────────────────────────────────
     Initial load – guardrails
  ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    handleSync();
  }, []);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const gData = await fetchGuardrails();

      // Normalise payload -> UI shape
      const mapped = gData.map((g) => ({
        id: g.id,
        name: g.name,
        type: g.type ?? 'Input',
        description: g.description ?? '',
        logic: g.logic ?? '',
        active: g.enabled ?? true,
      }));

      setGuardrails(mapped);
      toast({ title: 'Success', description: 'Guardrails synchronized successfully.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ────────────────────────────────────────────────────────────
     Toggle enabled / disabled
  ──────────────────────────────────────────────────────────── */
  const handleToggle = async (id) => {
    const current = guardrails.find((g) => g.id === id);
    if (!current) return;

    try {
      const updated = await updateGuardrail(id, {
        enabled: !current.active,
      });

      setGuardrails((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, active: updated.enabled } : g,
        ),
      );

      toast({
        title: 'Success',
        description: `Guardrail "${updated.name}" ${updated.enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    }
  };

  /* ────────────────────────────────────────────────────────────
     Add / Edit dialog helpers
  ──────────────────────────────────────────────────────────── */
  const openNewGuardrailDialog = () => {
    setEditingId(null);
    setForm(blankForm);
    setDialogOpen(true);
  };

  const openEditGuardrailDialog = (g) => {
    setEditingId(g.id);
    setForm({
      name: g.name,
      type: g.type,
      description: g.description,
      logic: g.logic,
      active: g.active,
    });
    setDialogOpen(true);
  };

  const handleFormChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    /* basic validation */
    if (!form.name || !form.description || !form.logic) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Name, logic, and description are required.',
      });
      return;
    }

    setIsLoading(true);
    const payload = {
      name: form.name,
      type: form.type,
      description:

 form.description,
      logic: form.logic,
      enabled: form.active,
    };

    try {
      if (editingId) {
        /* update */
        const updated = await updateGuardrail(editingId, payload);
        setGuardrails((prev) =>
          prev.map((g) =>
            g.id === editingId
              ? { ...g, ...payload, active: updated.enabled }
              : g,
          ),
        );
        toast({ 
          title: 'Success', 
          description: `Guardrail "${updated.name}" has been updated.` 
        });
      } else {
        /* create */
        const created = await createGuardrail(payload);
        setGuardrails((prev) => [
          {
            id: created.id,
            active: created.enabled,
            ...payload,
          },
          ...prev,
        ]);
        toast({ 
          title: 'Success', 
          description: `Guardrail "${created.name}" has been created.` 
        });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteGuardrail(id);
      setGuardrails((prev) => prev.filter((g) => g.id !== id));
      toast({ 
        title: 'Success', 
        description: `Guardrail has been deleted.` 
      });
      setDeleteDialogOpen(false);
      setGuardrailToDelete(null);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGuardrails = guardrails.filter(guardrail => {
    const matchesSearch = guardrail.name.toLowerCase().includes(search.toLowerCase()) ||
      guardrail.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || guardrail.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = type => {
    switch (type.toLowerCase()) {
      case 'input': return 'bg-blue-500/10 text-blue-500';
      case 'output': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  /* ────────────────────────────────────────────────────────────
     Render
  ──────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guardrails</h1>
          <p className="text-muted-foreground mt-2">
            Manage input/output filters for agent safety and control.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewGuardrailDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Guardrail
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Guardrail' : 'Create Guardrail'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Modify the guardrail configuration below.'
                    : 'Configure a new guardrail to ensure agent safety.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter guardrail name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="type">Type</label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => handleFormChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Input">Input</SelectItem>
                      <SelectItem value="Output">Output</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Describe what this guardrail does"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="logic">Logic</label>
                  <Textarea
                    id="logic"
                    value={form.logic}
                    onChange={(e) => handleFormChange('logic', e.target.value)}
                    placeholder="Enter guardrail logic"
                    className="font-mono min-h-[100px]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={form.active}
                    onCheckedChange={(checked) => handleFormChange('active', checked)}
                  />
                  <label htmlFor="active">Active</label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false);
                  setEditingId(null);
                  setForm(blankForm);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {editingId ? 'Saving...' : 'Creating...'}
                    </>
                  ) : (
                    editingId ? 'Save Changes' : 'Create Guardrail'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guardrails..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Input">Input</SelectItem>
                  <SelectItem value="Output">Output</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(prev => prev === 'grid' ? 'table' : 'grid')}
              >
                {viewMode === 'grid' ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <LayoutList className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guardrails List */}
      <Card>
        <CardHeader>
          <CardTitle>Guardrails</CardTitle>
          <CardDescription>
            {filteredGuardrails.length} {filteredGuardrails.length === 1 ? 'guardrail' : 'guardrails'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading guardrails...</p>
            </div>
          ) : filteredGuardrails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <ShieldCheck className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No guardrails found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuardrails.map((guardrail) => (
                <Card key={guardrail.id} className="hover:shadow-lg transition">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`p-1.5 rounded-lg ${getTypeColor(guardrail.type)}`}>
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                          <h3 className="font-semibold">{guardrail.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {guardrail.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggle(guardrail.id)}
                        >
                          {guardrail.active ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditGuardrailDialog(guardrail)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setGuardrailToDelete(guardrail);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        {guardrail.type}
                      </Badge>
                      <Badge variant={guardrail.active ? 'default' : 'secondary'}>
                        {guardrail.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuardrails.map((guardrail) => (
                    <TableRow key={guardrail.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span className={`p-1 rounded-lg ${getTypeColor(guardrail.type)}`}>
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                          <span>{guardrail.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {guardrail.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {guardrail.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={guardrail.active ? 'default' : 'secondary'}>
                          {guardrail.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggle(guardrail.id)}
                          >
                            {guardrail.active ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditGuardrailDialog(guardrail)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setGuardrailToDelete(guardrail);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Guardrail</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this guardrail? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {guardrailToDelete && (
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You are about to delete "{guardrailToDelete.name}". This may affect any agents using this guardrail.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteDialogOpen(false);
              setGuardrailToDelete(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(guardrailToDelete?.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuardrailsPage;