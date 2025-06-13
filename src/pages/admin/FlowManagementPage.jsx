import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

import { createFlow, deleteFlow, fetchFlows, updateFlow } from '@/services/api'; // API functions for managing flows
import {
  Edit,
  FilePlus2,
  PlusCircle,
  Power,
  Trash2,
  Workflow,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const FlowManagementPage = () => {
  const { toast } = useToast();
  const [flows, setFlows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const navigate = useNavigate();

  // Fetch flows from the backend
  useEffect(() => {
    fetchFlowsData();
  }, []);

  const fetchFlowsData = async () => {
    try {
      const fetchedFlows = await fetchFlows();
      setFlows(fetchedFlows);
    } catch (error) {
      console.error('Failed to fetch flows:', error);
    }
  };

  const saveFlows = (updated) => {
    setFlows(updated);
  };

  const resetForm = () => {
    setEditingFlow(null);
    setFlowName('');
    setFlowDescription('');
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (flow) => {
    setEditingFlow(flow);
    setFlowName(flow.name);
    setFlowDescription(flow.description);
    setIsDialogOpen(true);
  };

  const handleSaveFlow = async () => {
    if (!flowName || !flowDescription) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill out all fields.' });
      return;
    }

    const newFlow = {
      name: flowName,
      description: flowDescription,
      json_data: { nodes: [], edges: [] }, // Initialize empty nodes and edges, adjust as per your flow setup
    };

    try {
      if (editingFlow) {
        // Update the flow if it already exists
        await updateFlow(editingFlow.id, newFlow);
        toast({ title: 'Flow Updated' });
      } else {
        // Create a new flow
        await createFlow(newFlow);
        toast({ title: 'Flow Created' });
      }
      fetchFlowsData();  // Refresh the flow list after saving
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong while saving the flow.' });
    }
  };

  const handleDeleteFlow = async (id) => {
    try {
      await deleteFlow(id);
      toast({ title: 'Flow Deleted' });
      fetchFlowsData(); // Refresh the flow list after deletion
    } catch (error) {
      console.error('Error deleting flow:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong while deleting the flow.' });
    }
  };

  const handleToggleFlow = async (flowId, currentState) => {
    try {
      const updatedFlow = await updateFlow(flowId, { isActive: !currentState });
      toast({ 
        title: `Flow ${!currentState ? 'Activated' : 'Deactivated'}`,
        description: `The flow has been ${!currentState ? 'activated' : 'deactivated'} successfully.`
      });
      fetchFlowsData(); // Refresh the flow list
    } catch (error) {
      console.error('Error toggling flow:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to toggle flow status.' 
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Flow Management</h1>
        <Button size="sm" onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Flow
        </Button>
      </div>

      {flows.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/30 bg-muted/20">
          <CardHeader className="items-center text-center">
            <FilePlus2 className="h-12 w-12 text-primary mb-2" />
            <CardTitle>No Flows Created</CardTitle>
            <CardDescription>Click "Create New Flow" to get started building interactive AI flows.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => (
            <Card key={flow.id} className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{flow.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`flow-${flow.id}-toggle`} className="text-sm">
                        {flow.isActive ? 'Active' : 'Inactive'}
                      </Label>
                      <Switch
                        id={`flow-${flow.id}-toggle`}
                        checked={flow.isActive}
                        onCheckedChange={(checked) => handleToggleFlow(flow.id, flow.isActive)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Workflow className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/flows/${flow.id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit in Builder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFlow(flow.id, flow.isActive)}>
                          <Power className="h-4 w-4 mr-2" />
                          {flow.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteFlow(flow.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardTitle>
                <CardDescription>{flow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Created: {flow.createdAt} <br /> Updated: {flow.updatedAt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFlow ? 'Edit Flow' : 'Create New Flow'}</DialogTitle>
            <DialogDescription>
              {editingFlow ? 'Update your flow details.' : 'Set up a new AI flow for multi-step interactions.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="flow-name" className="text-right">Name</Label>
              <Input id="flow-name" value={flowName} onChange={(e) => setFlowName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="flow-description" className="text-right">Description</Label>
              <textarea
                id="flow-description"
                value={flowDescription}
                onChange={(e) => setFlowDescription(e.target.value)}
                className="col-span-3 border border-input rounded-md p-2 text-sm bg-background text-foreground min-h-[100px]"
                placeholder="Explain what this flow is designed to do."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveFlow}>{editingFlow ? 'Save Changes' : 'Create Flow'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlowManagementPage;
