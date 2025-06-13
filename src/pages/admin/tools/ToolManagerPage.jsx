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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  createTool,
  deleteTool,
  fetchAgents,
  fetchAvailableFunctions,
  fetchTools,
  updateTool,
} from '@/services/api';
import {
  AlertCircle,
  Cloud,
  Edit,
  GitBranch,
  LayoutGrid,
  LayoutList,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const ToolManagerPage = () => {
  const [tools, setTools] = useState([]);
  const [newTool, setNewTool] = useState({ name: '', type: '', description: '', config: '' });
  const [editingTool, setEditingTool] = useState(null);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [availableFunctions, setAvailableFunctions] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [hostedTools, setHostedTools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFunctionsLoading, setIsFunctionsLoading] = useState(false);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Load hosted tools
  useEffect(() => {
    const loadHostedTools = async () => {
      try {
        const response = await fetch('/api/admin/tools/hosted');
        if (!response.ok) throw new Error('Failed to fetch hosted tools');
        const data = await response.json();
        setHostedTools(data);
      } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
      }
    };
    loadHostedTools();
  }, []);

  // Load registered tools
  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTools();
        setTools(
          data.map((t) => ({
            id: t.id,
            name: t.name,
            type: t.type,
            description: t.description || '',
            icon: getIcon(t.type),
            details: t.config || '',
          }))
        );
      } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
      } finally {
        setIsLoading(false);
      }
    };
    loadTools();
  }, []);

  // Load function-tool names
  useEffect(() => {
    if (newTool.type === 'function' || editingTool?.type === 'function' || newTool.type === 'functions' || editingTool?.type === 'functions') {
      setIsFunctionsLoading(true);
      fetchAvailableFunctions()
        .then(setAvailableFunctions)
        .catch((e) => toast({ variant: 'destructive', title: 'Error', description: e.message }))
        .finally(() => setIsFunctionsLoading(false));
    } else {
      setAvailableFunctions([]);
    }
  }, [newTool.type, editingTool?.type]);

  // Load agents
  useEffect(() => {
    if (newTool.type === 'agent' || editingTool?.type === 'agent') {
      setIsAgentsLoading(true);
      fetchAgents()
        .then(setAvailableAgents)
        .catch((e) => toast({ variant: 'destructive', title: 'Error', description: e.message }))
        .finally(() => setIsAgentsLoading(false));
    } else {
      setAvailableAgents([]);
    }
  }, [newTool.type, editingTool?.type]);

  // Auto-open dialog when editing
  useEffect(() => {
    if (editingTool) {
      setIsDialogOpen(true);
    }
  }, [editingTool]);

  const getIcon = (type) => {
    switch (type) {
      case 'hosted':
        return <Cloud className="h-4 w-4" />;
      case 'function':
      case 'functions':
        return <Wrench className="h-4 w-4" />;
      case 'agent':
        return <GitBranch className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'hosted':
        return 'bg-blue-500/10 text-blue-500';
      case 'function':
      case 'functions':
        return 'bg-purple-500/10 text-purple-500';
      case 'agent':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const validateConfig = (cfg) => {
    if (!cfg) return true;
    try {
      JSON.parse(cfg);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddTool = async () => {
    if (!newTool.name || !newTool.type) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Name and type are required.' });
      return;
    }
    if (!validateConfig(newTool.config)) {
      toast({ variant: 'destructive', title: 'Invalid Config', description: 'Config must be valid JSON.' });
      return;
    }
    setIsLoading(true);
    try {
      const created = await createTool({
        name: newTool.name,
        type: newTool.type,
        description: newTool.description || null,
        config: newTool.config || null,
      });
      setTools((ts) => [
        ...ts,
        {
          id: created.id,
          name: created.name,
          type: created.type,
          description: created.description || '',
          icon: getIcon(created.type),
          details: created.config || '',
        },
      ]);
      setNewTool({ name: '', type: '', description: '', config: '' });
      setIsDialogOpen(false);
      toast({ title: 'Success', description: `Tool "${created.name}" has been added.` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTool = async () => {
    if (!editingTool.name || !editingTool.type) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Name and type are required.' });
      return;
    }
    if (!validateConfig(editingTool.config)) {
      toast({ variant: 'destructive', title: 'Invalid Config', description: 'Config must be valid JSON.' });
      return;
    }
    setIsLoading(true);
    try {
      const updated = await updateTool(editingTool.id, {
        name: editingTool.name,
        type: editingTool.type,
        description: editingTool.description || null,
        config: editingTool.config || null,
      });
      setTools((ts) =>
        ts.map((t) =>
          t.id === updated.id
            ? {
                ...t,
                name: updated.name,
                type: updated.type,
                description: updated.description || '',
                icon: getIcon(updated.type),
                details: updated.config || '',
              }
            : t
        )
      );
      setEditingTool(null);
      setIsDialogOpen(false);
      toast({ title: 'Success', description: `Tool "${updated.name}" has been updated.` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTool = async () => {
    if (!toolToDelete) return;
    setIsLoading(true);
    try {
      await deleteTool(toolToDelete.id);
      setTools((ts) => ts.filter((t) => t.id !== toolToDelete.id));
      toast({ title: 'Success', description: `Tool "${toolToDelete.name}" has been deleted.` });
      setToolToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTools();
      setTools(
        data.map((t) => ({
          id: t.id,
          name: t.name,
          type: t.type,
          description: t.description || '',
          icon: getIcon(t.type),
          details: t.config || '',
        }))
      );
      toast({ title: 'Success', description: 'Tools synchronized successfully.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || tool.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tool Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage and configure tools for your AI agents.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSync} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
                <DialogDescription>
                  {editingTool ? 'Modify the tool configuration below.' : 'Configure a new tool for your agents.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    value={editingTool?.name || newTool.name}
                    onChange={(e) =>
                      editingTool
                        ? setEditingTool({ ...editingTool, name: e.target.value })
                        : setNewTool({ ...newTool, name: e.target.value })
                    }
                    placeholder="Enter tool name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="type">Type</label>
                  <Select
                    value={editingTool?.type || newTool.type}
                    onValueChange={(value) => {
                      editingTool
                        ? setEditingTool({ ...editingTool, type: value, config: '' })
                        : setNewTool({ ...newTool, type: value, config: '' });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hosted">Hosted Tool</SelectItem>
                      <SelectItem value="function">Function Tool</SelectItem>
                      <SelectItem value="functions">Functions Tool</SelectItem>
                      <SelectItem value="agent">Agent Tool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(editingTool?.type === 'function' || newTool.type === 'function') && (
                  <div className="grid gap-2">
                    <label htmlFor="function">Function</label>
                    <Select
                      value={
                        editingTool?.config
                          ? JSON.parse(editingTool.config)?.function_name || ''
                          : JSON.parse(newTool.config || '{}')?.function_name || ''
                      }
                      onValueChange={(value) => {
                        const config = { function_name: value };
                        editingTool
                          ? setEditingTool({ ...editingTool, config: JSON.stringify(config) })
                          : setNewTool({ ...newTool, config: JSON.stringify(config) });
                      }}
                      disabled={isFunctionsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isFunctionsLoading ? 'Loading functions...' : 'Select a function'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFunctions.map((func) => (
                          <SelectItem key={func} value={func}>
                            {func}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(editingTool?.type === 'functions' || newTool.type === 'functions') && (
                  <div className="grid gap-2">
                    <label htmlFor="functions">Functions</label>
                    <Select
                      multiple
                      value={
                        editingTool?.config
                          ? JSON.parse(editingTool.config)?.function_names || []
                          : JSON.parse(newTool.config || '{}')?.function_names || []
                      }
                      onValueChange={(values) => {
                        const config = { function_names: values };
                        editingTool
                          ? setEditingTool({ ...editingTool, config: JSON.stringify(config) })
                          : setNewTool({ ...newTool, config: JSON.stringify(config) });
                      }}
                      disabled={isFunctionsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isFunctionsLoading ? 'Loading functions...' : 'Select functions'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFunctions.map((func) => (
                          <SelectItem key={func} value={func}>
                            {func}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(editingTool?.type === 'hosted' || newTool.type === 'hosted') && (
                  <div className="grid gap-2">
                    <label htmlFor="hostedTool">Hosted Tool</label>
                    <Select
                      value={
                        editingTool?.config
                          ? JSON.parse(editingTool.config)?.tool_name || ''
                          : JSON.parse(newTool.config || '{}')?.tool_name || ''
                      }
                      onValueChange={(value) => {
                        const config = { tool_name: value, params: {} };
                        editingTool
                          ? setEditingTool({ ...editingTool, config: JSON.stringify(config) })
                          : setNewTool({ ...newTool, config: JSON.stringify(config) });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a hosted tool" />
                      </SelectTrigger>
                      <SelectContent>
                        {hostedTools.map((tool) => (
                          <SelectItem key={tool.value} value={tool.value}>
                            {tool.label || tool.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(editingTool?.type === 'agent' || newTool.type === 'agent') && (
                  <div className="grid gap-2">
                    <label htmlFor="agent">Agent</label>
                    <Select
                      value={
                        editingTool?.config
                          ? JSON.parse(editingTool.config)?.agent_id || ''
                          : JSON.parse(newTool.config || '{}')?.agent_id || ''
                      }
                      onValueChange={(value) => {
                        const config = { agent_id: value };
                        editingTool
                          ? setEditingTool({ ...editingTool, config: JSON.stringify(config) })
                          : setNewTool({ ...newTool, config: JSON.stringify(config) });
                      }}
                      disabled={isAgentsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isAgentsLoading ? 'Loading agents...' : 'Select an agent'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAgents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name || agent.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    value={editingTool?.description || newTool.description}
                    onChange={(e) =>
                      editingTool
                        ? setEditingTool({ ...editingTool, description: e.target.value })
                        : setNewTool({ ...newTool, description: e.target.value })
                    }
                    placeholder="Describe what this tool does"
                  />
                </div>
                {(editingTool?.type === 'hosted' || newTool.type === 'hosted') && (
                  <div className="grid gap-2">
                    <label htmlFor="params">Parameters (JSON)</label>
                    <Textarea
                      id="params"
                      value={
                        editingTool?.config
                          ? JSON.stringify(JSON.parse(editingTool.config)?.params || {}, null, 2)
                          : JSON.stringify(JSON.parse(newTool.config || '{}')?.params || {}, null, 2)
                      }
                      onChange={(e) => {
                        try {
                          const params = JSON.parse(e.target.value);
                          const currentConfig = editingTool?.config
                            ? JSON.parse(editingTool.config)
                            : newTool.config
                            ? JSON.parse(newTool.config)
                            : {};
                          const updatedConfig = { ...currentConfig, params };
                          editingTool
                            ? setEditingTool({ ...editingTool, config: JSON.stringify(updatedConfig) })
                            : setNewTool({ ...newTool, config: JSON.stringify(updatedConfig) });
                        } catch {
                          // Ignore invalid JSON until submission
                        }
                      }}
                      placeholder="Enter JSON parameters for the hosted tool"
                      className="font-mono"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingTool(null);
                    setNewTool({ name: '', type: '', description: '', config: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingTool ? handleEditTool : handleAddTool} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {editingTool ? 'Saving...' : 'Creating...'}
                    </>
                  ) : (
                    editingTool ? 'Save Changes' : 'Create Tool'
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
                  placeholder="Search tools..."
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
                  <SelectItem value="hosted">Hosted</SelectItem>
                  <SelectItem value="function">Function</SelectItem>
                  <SelectItem value="functions">Functions</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode((prev) => (prev === 'grid' ? 'table' : 'grid'))}
              >
                {viewMode === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools List */}
      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
          <CardDescription>
            {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading tools...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Wrench className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No tools found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`p-1.5 rounded-lg ${getTypeColor(tool.type)}`}>{tool.icon}</span>
                          <h3 className="font-semibold">{tool.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {tool.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingTool(tool)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setToolToDelete(tool);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="capitalize">
                        {tool.type}
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
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span className={`p-1 rounded-lg ${getTypeColor(tool.type)}`}>{tool.icon}</span>
                          <span>{tool.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {tool.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {tool.description || 'No description provided'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => setEditingTool(tool)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setToolToDelete(tool);
                              setIsDeleteDialogOpen(true);
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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tool</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tool? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {toolToDelete && (
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You are about to delete "{toolToDelete.name}". This may affect any agents using this tool.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setToolToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTool} disabled={isLoading}>
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

export default ToolManagerPage;