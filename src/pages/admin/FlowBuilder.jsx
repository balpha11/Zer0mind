import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
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
import { createFlow, fetchFlows, updateFlow } from '@/services/api'; // Added API functions for managing flows
import { Play, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FlowRunnerModal from './FlowRunnerModal';

const defaultNodes = [
  { id: 'start', type: 'input', data: { label: 'Start Node' }, position: { x: 100, y: 100 } },
  { id: 'prompt-1', data: { label: 'Prompt Node', promptTemplate: 'Describe your idea to the AI...' }, position: { x: 300, y: 200 } },
  { id: 'end', type: 'output', data: { label: 'End Node' }, position: { x: 500, y: 300 } },
];

const defaultEdges = [
  { id: 'e1-2', source: 'start', target: 'prompt-1', label: '', data: { condition: '', style: { color: '#000000', type: 'solid', thickness: 2 } } },
  { id: 'e2-3', source: 'prompt-1', target: 'end', label: '', data: { condition: '', style: { color: '#000000', type: 'solid', thickness: 2 } } },
];

let promptNodeCount = 1;
const STORAGE_KEY = (flowId) => `flowbuilder_${flowId}`;

const ensureCoreNodes = (nodes) => {
  const hasStart = nodes.some((n) => n.id === 'start');
  const hasEnd = nodes.some((n) => n.id === 'end');
  const required = [];

  if (!hasStart) required.push({ id: 'start', type: 'input', data: { label: 'Start Node' }, position: { x: 100, y: 100 } });
  if (!hasEnd) required.push({ id: 'end', type: 'output', data: { label: 'End Node' }, position: { x: 600, y: 300 } });

  return [...nodes, ...required];
};

const FlowBuilder = () => {
  const { id } = useParams();
  const storageKey = STORAGE_KEY(id);
  const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
  const initNodes = ensureCoreNodes(stored?.nodes || defaultNodes);
  const initEdges = stored?.edges || defaultEdges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [history, setHistory] = useState([]);
  const [undoHistory, setUndoHistory] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [contextNode, setContextNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [label, setLabel] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [edgeCondition, setEdgeCondition] = useState('');
  const [edgeStyle, setEdgeStyle] = useState({ color: '#000000', type: 'solid', thickness: 2 });
  const [conditionOperator, setConditionOperator] = useState('equals');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [userInputs, setUserInputs] = useState({});

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ nodes, edges }));
  }, [nodes, edges, storageKey]);

  // Fetch flow data if editing an existing flow
  useEffect(() => {
    if (id) {
      fetchFlowData(id);
    }
  }, [id]);

  const fetchFlowData = async (flowId) => {
    try {
      const flow = await fetchFlows(flowId);
      setNodes(flow.json_data.nodes || []);
      setEdges(flow.json_data.edges || []);
    } catch (error) {
      console.error('Failed to fetch flow data:', error);
    }
  };

  const saveHistory = () => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    setUndoHistory([]); // Clear redo stack when new change is made
  };

  const handleNodeDoubleClick = (_event, node) => {
    if (!node || node.type === 'input' || node.type === 'output') return;
    setSelectedNode(node);
    setLabel(node.data.label || '');
    setPromptTemplate(node.data.promptTemplate || '');
    setIsDialogOpen(true);
  };

  const handleSaveNode = () => {
    const updated = nodes.map((n) =>
      n.id === selectedNode.id
        ? {
            ...n,
            data: {
              ...n.data,
              label,
              promptTemplate,
            },
          }
        : n
    );
    setNodes(updated);
    saveHistory();
    setIsDialogOpen(false);
    setSelectedNode(null);
  };

  const handleAddPromptNode = () => {
    promptNodeCount += 1;
    const newNode = {
      id: `prompt-${promptNodeCount}`,
      data: {
        label: `Prompt Node ${promptNodeCount}`,
        promptTemplate: 'New prompt goes here...',
      },
      position: { x: 200 + promptNodeCount * 50, y: 200 + promptNodeCount * 20 },
    };
    setNodes((nds) => nds.concat(newNode));
    saveHistory();
  };

  const handleNodeContextMenu = (_event, node) => {
    setContextNode(node);
  };

  const handleDeleteNode = () => {
    if (!contextNode || ['start', 'end'].includes(contextNode.id)) return;
    setEdges((eds) => eds.filter((e) => e.source !== contextNode.id && e.target !== contextNode.id));
    setNodes((nds) => nds.filter((n) => n.id !== contextNode.id));
    saveHistory();
    setContextNode(null);
  };

  const handleEdgeDoubleClick = (_event, edge) => {
    setSelectedEdge(edge);
    setEdgeCondition(edge.data?.condition || '');
    setEdgeStyle(edge.data?.style || { color: '#000000', type: 'solid', thickness: 2 });
    setConditionOperator(edge.data?.conditionOperator || 'equals');
    setIsEdgeDialogOpen(true);
  };

  const handleSaveEdgeCondition = () => {
    const updatedEdges = edges.map((e) =>
      e.id === selectedEdge.id
        ? {
            ...e,
            data: { ...e.data, condition: edgeCondition, style: edgeStyle, conditionOperator },
            label: edgeCondition,
          }
        : e
    );
    setEdges(updatedEdges);
    saveHistory();
    setIsEdgeDialogOpen(false);
    setSelectedEdge(null);
  };

  // Undo action
  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setUndoHistory((prev) => [...prev, { nodes, edges }]);  // Store current state in redo stack
    setNodes(lastState.nodes);
    setEdges(lastState.edges);
    setHistory((prev) => prev.slice(0, -1));  // Remove last state from history
  };

  // Redo action
  const handleRedo = () => {
    if (undoHistory.length === 0) return;
    const redoState = undoHistory[undoHistory.length - 1];
    setNodes(redoState.nodes);
    setEdges(redoState.edges);
    setHistory((prev) => [...prev, { nodes, edges }]);  // Save current state to history
    setUndoHistory((prev) => prev.slice(0, -1));  // Remove last state from redo stack
  };

  // Run Flow and check conditions
  const runFlow = async () => {
    let currentNodeId = 'start';
    const userResponses = {};

    while (currentNodeId !== 'end') {
      const currentNode = nodes.find((n) => n.id === currentNodeId);
      const prompt = currentNode?.data?.promptTemplate;
      const userInput = window.prompt(prompt); // Simulate user input

      if (userInput !== null) {
        userResponses[currentNodeId] = userInput;
        setUserInputs(userResponses); // Store user input

        const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId);
        let nextNodeId = null;

        for (const edge of outgoingEdges) {
          const conditionMet = evaluateCondition(edge.data?.condition, userInput);
          if (conditionMet) {
            nextNodeId = edge.target;
            break;
          }
        }

        if (!nextNodeId) {
          alert('No valid path, ending flow.');
          return;
        }
        
        currentNodeId = nextNodeId; // Move to the next node
      } else {
        alert('User cancelled flow.');
        break;
      }
    }

    alert('Flow completed!');
  };

  // Evaluate edge condition logic (equals, contains, etc.)
  const evaluateCondition = (condition, userInput) => {
    if (!condition) return true;
    const [operator, value] = condition.split(':');
    switch (operator) {
      case 'equals':
        return userInput === value;
      case 'contains':
        return userInput.includes(value);
      case 'greaterThan':
        return parseFloat(userInput) > parseFloat(value);
      case 'lessThan':
        return parseFloat(userInput) < parseFloat(value);
      default:
        return false;
    }
  };

  // Save flow data to backend
  const saveFlow = async () => {
    const flow = {
      name: 'Flow Name',  // Add dynamic name input if required
      description: 'Flow Description',  // Add dynamic description input if required
      json_data: { nodes, edges },
    };

    try {
      if (id) {
        // Update the flow if it already exists
        await updateFlow(id, flow);
      } else {
        // Create a new flow
        await createFlow(flow);
      }
    } catch (error) {
      console.error('Failed to save flow:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <h1 className="text-xl font-bold">Editing Flow: {id}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleUndo}>
            Undo
          </Button>
          <Button variant="secondary" onClick={handleRedo}>
            Redo
          </Button>
          <Button variant="secondary" onClick={handleAddPromptNode}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add Prompt Node
          </Button>
          <Button onClick={runFlow}>
            <Play className="h-4 w-4 mr-1" /> Run Flow
          </Button>
          <Button onClick={saveFlow}>
            {id ? 'Save Flow' : 'Create Flow'}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <ReactFlowProvider>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="h-full w-full">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={(params) =>
                    setEdges((eds) =>
                      addEdge({ ...params, label: '', data: { condition: '', style: { color: '#000000', type: 'solid', thickness: 2 } } }, eds)
                    )
                  }
                  onNodeDoubleClick={handleNodeDoubleClick}
                  onEdgeDoubleClick={handleEdgeDoubleClick}
                  onNodeContextMenu={handleNodeContextMenu}
                  fitView
                >
                  <MiniMap />
                  <Controls />
                  <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={handleDeleteNode}
                disabled={!contextNode || ['start', 'end'].includes(contextNode.id)}
                className={['start', 'end'].includes(contextNode?.id) ? 'opacity-50 pointer-events-none' : ''}
              >
                Delete Node
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </ReactFlowProvider>
      </div>

      {/* Node Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prompt Node</DialogTitle>
            <DialogDescription>Update the node label and prompt text.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node-label" className="text-right">Label</Label>
              <Input
                id="node-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="prompt-template" className="text-right">Prompt</Label>
              <textarea
                id="prompt-template"
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                className="col-span-3 border border-input rounded-md p-2 text-sm bg-background text-foreground min-h-[100px]"
                placeholder="e.g. 'Ask user to describe their project idea in detail.'"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNode}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edge Condition Edit Dialog */}
      <Dialog open={isEdgeDialogOpen} onOpenChange={setIsEdgeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Edge Condition</DialogTitle>
            <DialogDescription>
              Define a condition for when this edge should be followed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition-operator" className="text-right">Condition</Label>
              <div className="col-span-3">
                <select
                  id="condition-operator"
                  value={conditionOperator}
                  onChange={(e) => setConditionOperator(e.target.value)}
                  className="h-10 w-full rounded-md border px-3 text-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greaterThan">Greater Than</option>
                  <option value="lessThan">Less Than</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition-value" className="text-right">Value</Label>
              <Input
                id="condition-value"
                value={edgeCondition}
                onChange={(e) => setEdgeCondition(e.target.value)}
                className="col-span-3"
                placeholder="Enter value to compare"
              />
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-color" className="text-right">Edge Color</Label>
              <div className="col-span-3">
                <input
                  type="color"
                  value={edgeStyle.color}
                  onChange={(e) => setEdgeStyle({ ...edgeStyle, color: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-type" className="text-right">Edge Type</Label>
              <div className="col-span-3">
                <select
                  id="edge-type"
                  value={edgeStyle.type}
                  onChange={(e) => setEdgeStyle({ ...edgeStyle, type: e.target.value })}
                  className="h-10 w-full rounded-md border px-3 text-sm"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-thickness" className="text-right">Thickness</Label>
              <div className="col-span-3">
                <input
                  type="number"
                  value={edgeStyle.thickness}
                  min="1"
                  max="10"
                  onChange={(e) => setEdgeStyle({ ...edgeStyle, thickness: e.target.value })}
                  className="w-full h-10 px-3 border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEdgeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdgeCondition}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FlowRunnerModal
        open={isRunnerOpen}
        onOpenChange={setIsRunnerOpen}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
};

export default FlowBuilder;
