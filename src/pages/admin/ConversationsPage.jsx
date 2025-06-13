import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, User, Bot, Clock, AlertTriangle, Search, Filter } from 'lucide-react';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      user: "john@example.com",
      startTime: "2024-03-20 14:30",
      duration: "5m 30s",
      status: "completed",
      model: "GPT-4",
      messageCount: 12,
      satisfaction: "high",
      errorCount: 0
    },
    {
      id: 2,
      user: "sarah@example.com",
      startTime: "2024-03-20 14:25",
      duration: "3m 45s",
      status: "active",
      model: "GPT-3.5",
      messageCount: 8,
      satisfaction: "medium",
      errorCount: 1
    }
  ]);

  const [filters, setFilters] = useState({
    status: "all",
    model: "all",
    satisfaction: "all"
  });

  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSatisfactionColor = (satisfaction) => {
    switch (satisfaction) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            Monitor and analyze AI agent conversations
          </p>
        </div>
        <Button>
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Analytics</CardTitle>
          <CardDescription>Real-time monitoring of agent-user interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.model}
                onValueChange={(value) => setFilters({ ...filters, model: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conversations List */}
            <div className="space-y-4">
              {conversations.map(conversation => (
                <Card key={conversation.id} className="hover:bg-muted/50 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{conversation.user}</span>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(conversation.status)}`} />
                          <Badge variant="outline">{conversation.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {conversation.startTime}
                          </div>
                          <div>Duration: {conversation.duration}</div>
                          <div>Model: {conversation.model}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{conversation.messageCount} messages</span>
                          </div>
                          {conversation.errorCount > 0 && (
                            <div className="flex items-center space-x-1 text-red-500">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{conversation.errorCount} errors</span>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center space-x-1 ${getSatisfactionColor(conversation.satisfaction)}`}>
                          <span className="capitalize">{conversation.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationsPage; 