// src/pages/admin/FlowRunnerModal.jsx

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

function getNextNodeId(currentId, userInput, edges) {
  const outgoing = edges.filter((e) => e.source === currentId);

  for (const edge of outgoing) {
    if (!edge.label && edge.data?.condition === '') {
      return edge.target;
    }

    const conditionText = edge.label || edge.data?.condition || '';
    const [type, expected] = conditionText.split(':');

    if (type === 'equals') {
      if (userInput.trim().toLowerCase() === expected.trim().toLowerCase()) {
        return edge.target;
      }
    }
  }

  return outgoing[0]?.target || null;
}

export default function FlowRunnerModal({ open, onOpenChange, nodes, edges, onComplete }) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const [currentId, setCurrentId] = useState('start');
  const [responses, setResponses] = useState({});

  useEffect(() => {
    if (open) {
      setCurrentId('start');
      setResponses({});
    }
  }, [open]);

  const currentNode = nodeMap[currentId];
  const isEnd = !currentNode || currentNode.type === 'output';

  const handleNext = () => {
    const userInput = responses[currentId] || '';
    const nextId = getNextNodeId(currentId, userInput, edges);

    if (!nextId || nextId === 'end') {
      onComplete?.(responses);
      onOpenChange(false);
    } else {
      setCurrentId(nextId);
    }
  };

  const handleChange = (e) => {
    setResponses((r) => ({ ...r, [currentId]: e.target.value }));
  };

  if (isEnd) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{currentNode?.data.label || 'Step'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <p className="text-sm text-muted-foreground">
            {currentNode?.data.promptTemplate}
          </p>
          <Input
            value={responses[currentId] || ''}
            onChange={handleChange}
            placeholder="Type your answer here..."
          />
        </div>
        <DialogFooter>
          <Button onClick={handleNext}>
            {currentId === 'start' ? 'Start' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
