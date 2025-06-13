import React from 'react';
import { Sparkles, Zap, Cpu } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

const MODELS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    icon: Sparkles,
    badge: 'Pro'
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5',
    description: 'Fast and efficient for most tasks',
    icon: Zap,
    badge: null
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Advanced reasoning and analysis',
    icon: Cpu,
    badge: 'New'
  }
];

const ModelSelector = ({ value, onValueChange }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full md:w-[180px] h-9">
        <SelectValue placeholder="Select AI model" />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                {React.createElement(model.icon, {
                  className: "h-4 w-4 text-primary"
                })}
              </div>
              <div className="flex flex-col min-w-[120px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  {model.badge && (
                    <Badge variant="secondary" className="h-5">
                      {model.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {model.description}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector; 