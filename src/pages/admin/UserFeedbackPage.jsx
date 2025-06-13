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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { MessageCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const initialFeedback = [
  {
    id: 'f1',
    user: 'guest-8291',
    agent: 'Startup Coach',
    rating: '👍',
    comment: 'Very helpful advice on funding!',
    date: '2025-05-25 10:04',
  },
  {
    id: 'f2',
    user: 'pro-3412',
    agent: 'Marketing Agent',
    rating: '👎',
    comment: 'Too generic response, needs improvement.',
    date: '2025-05-25 09:52',
  },
  {
    id: 'f3',
    user: 'enterprise-887',
    agent: 'Enterprise Advisor',
    rating: '👍',
    comment: 'Helped us identify workflow inefficiencies.',
    date: '2025-05-25 09:30',
  },
];

const UserFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState(initialFeedback);

  const handleRefresh = () => {
    // Future: Fetch from backend
    toast({
      title: 'Feedback Refreshed',
      description: 'Latest user feedback loaded.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Feedback</h1>
          <p className="text-sm text-muted-foreground">
            Review user comments, ratings, and suggestions about AI agents.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="secondary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Feedback
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>
            Collected after each agent interaction. Monitor satisfaction and improve prompts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <MessageCircle className="h-4 w-4" />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackList.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.rating}</TableCell>
                  <TableCell className="font-medium">{f.user}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{f.agent}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={f.rating === '👍' ? 'text-green-600' : 'text-red-600'}>
                      {f.rating === '👍' ? 'Helpful' : 'Needs Work'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{f.comment}</TableCell>
                  <TableCell className="text-xs">{f.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFeedbackPage;
