import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { createAgent, deleteAgent, fetchAgents, fetchApiKeys, updateAgent } from '@/services/api';
import {
  AlertCircle,
  ArrowUpDown,
  Bot,
  CheckCircle2,
  Copy,
  Download,
  FileCode,
  KeyRound,
  LayoutGrid,
  LayoutList,
  MoreHorizontal,
  PlusCircle,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Trash2,
  Wrench,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

// All agent fields, matching backend
const defaultAgent = {
  name: '',
  description: '',
  instructions: '',
  version: '1.0.0',
  status: 'active',
  type: 'agent',
  handoffs: [],
  flow_ids: [],
  tools: [],
  guardrails: [],
  openai_api_key_id: '', // Field to store the selected OpenAI API key ID
};

const AgentRegistryPage = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const [newAgent, setNewAgent] = useState(defaultAgent);
  const [editAgent, setEditAgent] = useState(null);

  // State to store available OpenAI API keys for selection and loading state
  const [availableOpenaiApiKeys, setAvailableOpenaiApiKeys] = useState([]);
  const [isLoadingApiKeys, setIsLoadingApiKeys] = useState(false);

  // Function to load API keys
  const loadOpenaiApiKeys = async () => {
    try {
      setIsLoadingApiKeys(true);
      const keys = await fetchApiKeys();
      console.log('Raw API Keys:', keys); // Debug: Log raw response
      // Filter for OpenAI-compatible models
      const openaiModels = ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o'];
      const openaiKeys = keys.filter(key => openaiModels.includes(key.model));
      console.log('Filtered OpenAI Keys:', openaiKeys); // Debug: Log filtered keys
      setAvailableOpenaiApiKeys(openaiKeys);
    } catch (error) {
      console.error('Failed to fetch OpenAI API keys for selection', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load OpenAI API keys. Please check API Key Management.',
      });
    } finally {
      setIsLoadingApiKeys(false);
    }
  };

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await fetchAgents();
      setAgents(data);
      setFilteredAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch agents. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load of agents when component mounts
  useEffect(() => {
    loadAgents();
  }, []);

  // Fetch API keys specifically when the Create Dialog opens
  useEffect(() => {
    if (isCreateDialogOpen) {
      loadOpenaiApiKeys();
    }
  }, [isCreateDialogOpen]);

  // Fetch API keys specifically when the Edit Dialog opens
  useEffect(() => {
    if (isEditDialogOpen) {
      loadOpenaiApiKeys();
    }
  }, [isEditDialogOpen]);

  // Filter and sort agents (runs when agents, search, filters, or sortConfig change)
  useEffect(() => {
    let result = [...agents];

    // Apply search filter
    if (search) {
      result = result.filter(agent =>
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(agent => agent.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(agent => agent.type === typeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredAgents(result);
  }, [agents, search, statusFilter, typeFilter, sortConfig]);

  const handleCreateAgent = async () => {
    try {
      const payload = {
        ...newAgent,
        tools: newAgent.tools || [],
        guardrails: newAgent.guardrails || [],
        flow_ids: newAgent.flow_ids || [],
        handoffs: newAgent.handoffs || [],
        // Convert "null" string from Select back to actual null for backend
        openai_api_key_id: newAgent.openai_api_key_id === 'null' ? null : newAgent.openai_api_key_id,
      };
      const created = await createAgent(payload);
      setAgents((prev) => [...prev, created]);
      toast({
        title: 'Success',
        description: 'Agent created successfully.',
      });
    } catch (err) {
      console.error('Failed to create agent', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create agent. Please try again.',
      });
    } finally {
      setIsCreateDialogOpen(false);
      setNewAgent(defaultAgent); // Resetting to defaultAgent will clear the selected ID too
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleEditClick = (agent) => {
    // Defensive: ensure all arrays exist and openai_api_key_id is initialized.
    // Convert actual null/undefined to "null" string for Select component's controlled value.
    setEditAgent({
      ...agent,
      tools: agent.tools || [],
      guardrails: agent.guardrails || [],
      flow_ids: agent.flow_ids || [],
      handoffs: agent.handoffs || [],
      // If openai_api_key_id is null or undefined from backend, set to "null" string for Select
      openai_api_key_id: agent.openai_api_key_id === null || agent.openai_api_key_id === undefined ? 'null' : agent.openai_api_key_id,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAgent = async () => {
    try {
      const payload = {
        ...editAgent,
        tools: editAgent.tools || [],
        guardrails: editAgent.guardrails || [],
        flow_ids: editAgent.flow_ids || [],
        handoffs: editAgent.handoffs || [],
        // Convert "null" string from Select back to actual null for backend
        openai_api_key_id: editAgent.openai_api_key_id === 'null' ? null : editAgent.openai_api_key_id,
      };
      await updateAgent(editAgent.id, payload);
      await loadAgents(); // Reload agents to reflect changes, including the API key association
      toast({
        title: 'Success',
        description: 'Agent updated successfully.',
      });
    } catch (err) {
      console.error('Failed to update agent', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update agent. Please try again.',
      });
    } finally {
      setIsEditDialogOpen(false);
      setEditAgent(null);
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: 'Success',
        description: 'Agent deleted successfully.',
      });
    } catch (err) {
      console.error('Failed to delete agent', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete agent. Please try again.',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAgents.length === 0) return;

    try {
      await Promise.all(selectedAgents.map(id => deleteAgent(id)));
      setAgents(prev => prev.filter(agent => !selectedAgents.includes(agent.id)));
      setSelectedAgents([]);
      toast({
        title: 'Success',
        description: `Successfully deleted ${selectedAgents.length} agents.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete some agents. Please try again.',
      });
    }
  };

  const handleExport = () => {
    const selectedAgentsData = agents.filter(agent => selectedAgents.includes(agent.id));
    const dataStr = JSON.stringify(selectedAgentsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agents.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const AgentStatus = ({ status }) => (
    <Badge variant={status === 'active' ? "success" : "secondary"}>
      <div className="flex items-center space-x-1">
        {status === 'active' ? (
          <CheckCircle2 className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        <span>{status}</span>
      </div>
    </Badge>
  );

  const AgentType = ({ type }) => (
    <Badge variant={type === 'agent' ? "default" : "outline"}>
      <div className="flex items-center space-x-1">
        {type === 'agent' ? (
          <Bot className="h-3 w-3" />
        ) : (
          <Wrench className="h-3 w-3" />
        )}
        <span>{type}</span>
      </div>
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Registry</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents and their configurations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadAgents}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {selectedAgents.length > 0 && (
            <>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </>
          )}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Agent</DialogTitle>
                <DialogDescription>
                  Add a new agent to your registry. Configure its basic settings below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    placeholder="Enter agent name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                    placeholder="Describe what this agent does"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <textarea
                    id="instructions"
                    value={newAgent.instructions}
                    onChange={(e) => setNewAgent({ ...newAgent, instructions: e.target.value })}
                    placeholder="Provide detailed instructions for the agent"
                    className="min-h-[100px] rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={newAgent.version}
                      onChange={(e) => setNewAgent({ ...newAgent, version: e.target.value })}
                      placeholder="1.0.0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newAgent.status}
                      onValueChange={(value) => setNewAgent({ ...newAgent, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* OpenAI API Key selection for Create Dialog */}
                <div className="grid gap-2">
                  <Label htmlFor="openai-api-key">OpenAI API Key (Optional)</Label>
                  <Select
                    value={newAgent.openai_api_key_id || 'null'}
                    onValueChange={(value) => setNewAgent({ ...newAgent, openai_api_key_id: value })}
                  >
                    <SelectTrigger id="openai-api-key">
                      <SelectValue placeholder={isLoadingApiKeys ? "Loading API Keys..." : "Select an OpenAI API Key"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">No API Key (use default)</SelectItem>
                      {isLoadingApiKeys ? (
                        <div className="flex items-center justify-center p-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Loading...</span>
                        </div>
                      ) : (
                        availableOpenaiApiKeys.map((key) => (
                          <SelectItem key={key.id} value={key.id}>
                            <div className="flex items-center">
                              <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                              {key.name} ({key.model})
                              {key.key_prefix && ` (...${key.key_prefix})`}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {availableOpenaiApiKeys.length === 0 && !isLoadingApiKeys && (
                    <Alert variant="info" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No API Keys Available</AlertTitle>
                      <AlertDescription>
                        Please go to the API Key Management page to create OpenAI API keys.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAgent}>Create Agent</Button>
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
                  placeholder="Search agents..."
                  value={search}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
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

      {/* Agents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agents</CardTitle>
              <CardDescription>
                {filteredAgents.length} agents found
              </CardDescription>
            </div>
            {selectedAgents.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {selectedAgents.length} selected
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading agents...</p>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bot className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No agents found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {agent.description}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditClick(agent)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            navigator.clipboard.writeText(agent.instructions);
                            toast({ title: 'Copied', description: 'Instructions copied to clipboard' });
                          }}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Instructions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setAgentToDelete(agent);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AgentStatus status={agent.status} />
                      <AgentType type={agent.type} />
                      <Badge variant="outline">v{agent.version}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <Shield className="h-3 w-3 mb-1" />
                        {agent.guardrails?.length || 0} guardrails
                      </div>
                      <div>
                        <Wrench className="h-3 w-3 mb-1" />
                        {agent.tools?.length || 0} tools
                      </div>
                      <div>
                        <FileCode className="h-3 w-3 mb-1" />
                        {agent.flow_ids?.length || 0} flows
                      </div>
                    </div>
                    {/* Display assigned API Key (Optional) */}
                    {agent.openai_api_key_id && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <KeyRound className="h-3 w-3 mr-1" />
                        API Key: {
                          availableOpenaiApiKeys.find(key => key.id === agent.openai_api_key_id)?.name || 'Unknown'
                        } ({
                          availableOpenaiApiKeys.find(key => key.id === agent.openai_api_key_id)?.model || 'Unknown'
                        })
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedAgents.length === filteredAgents.length}
                        onChange={(e) => {
                          setSelectedAgents(
                            e.target.checked
                              ? filteredAgents.map((agent) => agent.id)
                              : []
                          );
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center space-x-1 cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <span>Name</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Tools</TableHead>
                    <TableHead>Guardrails</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedAgents.includes(agent.id)}
                          onChange={(e) => {
                            setSelectedAgents(
                              e.target.checked
                                ? [...selectedAgents, agent.id]
                                : selectedAgents.filter((id) => id !== agent.id)
                            );
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {agent.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AgentStatus status={agent.status} />
                      </TableCell>
                      <TableCell>
                        <AgentType type={agent.type} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">v{agent.version}</Badge>
                      </TableCell>
                      <TableCell>{agent.tools?.length || 0}</TableCell>
                      <TableCell>{agent.guardrails?.length || 0}</TableCell>
                      <TableCell>
                        {agent.openai_api_key_id ? (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <KeyRound className="h-3 w-3 mr-1" />
                            {availableOpenaiApiKeys.find(key => key.id === agent.openai_api_key_id)?.name || 'Unknown'} ({availableOpenaiApiKeys.find(key => key.id === agent.openai_api_key_id)?.model || 'Unknown'})
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(agent)}>
                              <Settings className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(agent.instructions);
                              toast({ title: 'Copied', description: 'Instructions copied to clipboard' });
                            }}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Instructions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setAgentToDelete(agent);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update agent configuration and settings.
            </DialogDescription>
          </DialogHeader>
          {editAgent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editAgent.name}
                  onChange={(e) => setEditAgent({ ...editAgent, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editAgent.description}
                  onChange={(e) => setEditAgent({ ...editAgent, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-instructions">Instructions</Label>
                <textarea
                  id="edit-instructions"
                  value={editAgent.instructions}
                  onChange={(e) => setEditAgent({ ...editAgent, instructions: e.target.value })}
                  className="min-h-[100px] rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-version">Version</Label>
                  <Input
                    id="edit-version"
                    value={editAgent.version}
                    onChange={(e) => setEditAgent({ ...editAgent, version: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editAgent.status}
                    onValueChange={(value) => setEditAgent({ ...editAgent, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* OpenAI API Key selection for Edit Dialog */}
              <div className="grid gap-2">
                <Label htmlFor="edit-openai-api-key">OpenAI API Key (Optional)</Label>
                <Select
                  value={editAgent.openai_api_key_id === null || editAgent.openai_api_key_id === undefined ? 'null' : editAgent.openai_api_key_id}
                  onValueChange={(value) => setEditAgent({ ...editAgent, openai_api_key_id: value })}
                >
                  <SelectTrigger id="edit-openai-api-key">
                    <SelectValue placeholder={isLoadingApiKeys ? "Loading API Keys..." : "Select an OpenAI API Key"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">No API Key (use default)</SelectItem>
                    {isLoadingApiKeys ? (
                      <div className="flex items-center justify-center p-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Loading...</span>
                      </div>
                    ) : (
                      availableOpenaiApiKeys.map((key) => (
                        <SelectItem key={key.id} value={key.id}>
                          <div className="flex items-center">
                            <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                            {key.name} ({key.model})
                            {key.key_prefix && ` (...${key.key_prefix})`}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {availableOpenaiApiKeys.length === 0 && !isLoadingApiKeys && (
                  <Alert variant="info" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No API Keys Available</AlertTitle>
                    <AlertDescription>
                      Please go to the API Key Management page to create OpenAI API keys.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAgent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this agent? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {agentToDelete && (
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  You are about to delete "{agentToDelete.name}". This will remove all associated
                  configurations and relationships.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => agentToDelete && handleDeleteAgent(agentToDelete.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentRegistryPage;