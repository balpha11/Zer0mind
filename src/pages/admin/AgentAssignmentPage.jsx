import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchAgents,
  fetchGuardrails,
  fetchTools,
  updateAgent,
} from '@/services/api';
import {
  Bot,
  RefreshCw,
  Search,
  Shield,
  Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';

const AgentAssignmentPage = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState([]);
  const [guardrails, setGuardrails] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchGuardrails, setSearchGuardrails] = useState('');
  const [searchTools, setSearchTools] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [agentsData, guardrailsData, toolsData] = await Promise.all([
        fetchAgents(),
        fetchGuardrails(),
        fetchTools(),
      ]);
      setAgents(agentsData);
      setGuardrails(guardrailsData);
      setTools(toolsData);
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredGuardrails = guardrails.filter((guardrail) =>
    guardrail.name.toLowerCase().includes(searchGuardrails.toLowerCase())
  );

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTools.toLowerCase())
  );

  const handleEditClick = (agent) => {
    setSelectedAgent({
      ...agent,
      selectedGuardrails: agent.guardrails || [],
      selectedTools: agent.tools || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAgent = async () => {
    try {
      setLoading(true);
      await updateAgent(selectedAgent.id, {
        ...selectedAgent,
        guardrails: selectedAgent.selectedGuardrails,
        tools: selectedAgent.selectedTools,
      });
      await loadData();
      toast({
        title: "Success",
        description: "Agent assignments updated successfully",
      });
    } catch (err) {
      console.error('Failed to update agent', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update agent assignments. Please try again.",
      });
    } finally {
      setIsEditDialogOpen(false);
      setSelectedAgent(null);
      setLoading(false);
    }
  };

  const toggleGuardrail = (guardrailId) => {
    setSelectedAgent((prev) => {
      const selectedGuardrails = prev.selectedGuardrails.includes(guardrailId)
        ? prev.selectedGuardrails.filter((id) => id !== guardrailId)
        : [...prev.selectedGuardrails, guardrailId];
      return { ...prev, selectedGuardrails };
    });
  };

  const toggleTool = (toolId) => {
    setSelectedAgent((prev) => {
      const selectedTools = prev.selectedTools.includes(toolId)
        ? prev.selectedTools.filter((id) => id !== toolId)
        : [...prev.selectedTools, toolId];
      return { ...prev, selectedTools };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Assignment</h1>
        <p className="text-muted-foreground mt-2">
          Manage guardrails and tools assignments for your AI agents.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine the list of agents based on your criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={search}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
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
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>{(agent.guardrails || []).length} Guardrails</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span>{(agent.tools || []).length} Tools</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleEditClick(agent)}
                  >
                    Manage Assignments
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Manage Assignments - {selectedAgent?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Assign guardrails and tools to enhance agent capabilities.
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <Tabs defaultValue="guardrails" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="guardrails">
                  <Shield className="h-4 w-4 mr-2" />
                  Guardrails
                </TabsTrigger>
                <TabsTrigger value="tools">
                  <Wrench className="h-4 w-4 mr-2" />
                  Tools
                </TabsTrigger>
              </TabsList>
              <TabsContent value="guardrails" className="mt-4">
                <div className="space-y-4">
                  <Input
                    placeholder="Search guardrails..."
                    value={searchGuardrails}
                    onChange={(e) => setSearchGuardrails(e.target.value)}
                  />
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {filteredGuardrails.map((guardrail) => (
                        <div
                          key={guardrail.id}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted"
                        >
                          <Switch
                            id={`guardrail-${guardrail.id}`}
                            checked={selectedAgent.selectedGuardrails.includes(
                              guardrail.id
                            )}
                            onCheckedChange={() => toggleGuardrail(guardrail.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`guardrail-${guardrail.id}`} className="font-medium">
                              {guardrail.name}
                            </Label>
                            {guardrail.description && (
                              <p className="text-sm text-muted-foreground">
                                {guardrail.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="tools" className="mt-4">
                <div className="space-y-4">
                  <Input
                    placeholder="Search tools..."
                    value={searchTools}
                    onChange={(e) => setSearchTools(e.target.value)}
                  />
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {filteredTools.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted"
                        >
                          <Switch
                            id={`tool-${tool.id}`}
                            checked={selectedAgent.selectedTools.includes(tool.id)}
                            onCheckedChange={() => toggleTool(tool.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`tool-${tool.id}`} className="font-medium">
                              {tool.name}
                            </Label>
                            {tool.description && (
                              <p className="text-sm text-muted-foreground">
                                {tool.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAgent} disabled={loading}>
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

export default AgentAssignmentPage; 