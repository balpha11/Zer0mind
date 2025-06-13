import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { fetchAgents, updateAgent } from '@/services/api';
import {
  ArrowRightLeft,
  ArrowUpDown,
  Bot,
  Network,
  RefreshCw,
  Search,
  Settings,
  Share2
} from 'lucide-react';
import { useEffect, useState } from 'react';

const AgentOrchestrationPage = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const [handoffDialogOpen, setHandoffDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedHandoffs, setSelectedHandoffs] = useState([]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await fetchAgents();
      const normalized = data.map((a) => ({
        ...a,
        handoffs: Array.isArray(a.handoffs) ? a.handoffs : [],
      }));
      setAgents(normalized);
    } catch (error) {
      console.error('Failed to fetch agents', error);
      toast({
        title: 'Error loading agents',
        description: 'Check your network or server status.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await loadAgents();
      toast({
        title: 'Success',
        description: 'Agent configurations synced successfully.',
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync agent configurations.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const openHandoffDialog = (agent) => {
    setSelectedAgent(agent);
    setSelectedHandoffs(agent.handoffs || []);
    setHandoffDialogOpen(true);
  };

  const handleSaveHandoffs = async () => {
    try {
      setLoading(true);
      const updated = { ...selectedAgent, handoffs: selectedHandoffs };
      await updateAgent(selectedAgent.id, { handoffs: selectedHandoffs });
      
      setAgents(agents.map((a) => a.id === selectedAgent.id ? updated : a));
      toast({
        title: 'Success',
        description: `Updated handoff configuration for ${selectedAgent.name}`,
      });
      setHandoffDialogOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update handoff configuration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.description?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Orchestration</h1>
        <p className="text-muted-foreground mt-2">
          Configure how agents collaborate and hand off tasks to each other.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSync} variant="secondary" disabled={syncing}>
            {syncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Agents
              </>
            )}
          </Button>
          <Button asChild>
            <a href="/admin/flowbuilder/triage">
              <Network className="mr-2 h-4 w-4" />
              Flow Builder
            </a>
          </Button>
        </div>
      </div>

      {/* Agent Cards */}
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading agents...</p>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-8">
              <Bot className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No agents found</p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {agent.name}
                    </CardTitle>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">Handoffs</h4>
                      </div>
                      {agent.handoffs?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {agent.handoffs.map((target) => (
                            <Badge key={target} variant="outline" className="text-xs">
                              {target}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No handoffs configured</p>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => openHandoffDialog(agent)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Handoffs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Agent Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Relationships</CardTitle>
          <CardDescription>
            Comprehensive view of agent handoff configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Agent
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Handoffs</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {agent.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.handoffs?.length > 0 ? (
                          agent.handoffs.map((target) => (
                            <Badge key={target} variant="outline" className="text-xs">
                              {target}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openHandoffDialog(agent)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Configure Handoff Dialog */}
      <Dialog open={handoffDialogOpen} onOpenChange={setHandoffDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Configure Handoffs
            </DialogTitle>
            <DialogDescription>
              Select which agents {selectedAgent?.name} can hand off tasks to.
            </DialogDescription>
          </DialogHeader>

          {selectedAgent && (
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-4">
                {agents
                  .filter((a) => a.id !== selectedAgent.id)
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted"
                    >
                      <Checkbox
                        id={`agent-${a.id}`}
                        checked={selectedHandoffs.includes(a.name)}
                        onCheckedChange={(checked) => {
                          setSelectedHandoffs((prev) =>
                            checked
                              ? [...prev, a.name]
                              : prev.filter((h) => h !== a.name)
                          );
                        }}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={`agent-${a.id}`} className="font-medium">
                          {a.name}
                        </Label>
                        {a.description && (
                          <p className="text-sm text-muted-foreground">
                            {a.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHandoffDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHandoffs} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentOrchestrationPage;
