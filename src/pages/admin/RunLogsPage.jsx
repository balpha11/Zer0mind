import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Sample static log data (replace with API later)
const mockLogs = [
  {
    id: '1',
    agent: 'Startup Coach',
    query: 'How do I validate my MVP?',
    time: '2025-05-25 11:43',
    duration: '2.4s',
    status: 'success',
    summary: 'Suggested 3 methods to test MVP',
  },
  {
    id: '2',
    agent: 'Enterprise Advisor',
    query: 'Optimize our onboarding process',
    time: '2025-05-25 11:39',
    duration: '4.2s',
    status: 'success',
    summary: 'Recommended automation and async flows',
  },
  {
    id: '3',
    agent: 'Triage Agent',
    query: 'Can you solve this integral?',
    time: '2025-05-25 11:28',
    duration: '1.1s',
    status: 'blocked',
    summary: 'Input guardrail triggered: homework block',
  },
];

const RunLogsPage = () => {
  const [logs, setLogs] = useState(mockLogs);

  const handleRefresh = () => {
    // Future: fetch from backend
    toast({
      title: 'Logs Refreshed',
      description: 'Run logs updated.',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'blocked':
        return <Badge variant="outline">Blocked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Run Logs</h1>
          <p className="text-sm text-muted-foreground">
            View recent agent executions and guardrail activity.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="secondary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>
            Includes successful runs, blocked guardrails, and errors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Bot className="h-4 w-4" />
                </TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>User Query</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell><Clock className="h-4 w-4 text-muted-foreground" /></TableCell>
                  <TableCell className="font-medium">{log.agent}</TableCell>
                  <TableCell>{log.query}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{log.summary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunLogsPage;
