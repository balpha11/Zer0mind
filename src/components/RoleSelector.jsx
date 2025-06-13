import React from 'react';
import { 
  Bot, 
  Rocket, 
  LineChart, 
  MessageSquare, 
  Briefcase,
  Brain
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

const ROLES = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Versatile help for any task',
    icon: Bot,
    badge: null
  },
  {
    id: 'founder',
    name: 'Founder Support',
    description: 'Strategic startup guidance',
    icon: Rocket,
    badge: 'Pro'
  },
  {
    id: 'marketing',
    name: 'Marketing Expert',
    description: 'Growth and marketing strategy',
    icon: LineChart,
    badge: null
  },
  {
    id: 'sales',
    name: 'Sales Advisor',
    description: 'Sales and revenue optimization',
    icon: MessageSquare,
    badge: null
  },
  {
    id: 'product',
    name: 'Product Manager',
    description: 'Product strategy and development',
    icon: Briefcase,
    badge: null
  },
  {
    id: 'technical',
    name: 'Technical Expert',
    description: 'Technical architecture and coding',
    icon: Brain,
    badge: 'New'
  }
];

const RoleSelector = ({ value, onValueChange }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full md:w-[200px] h-9">
        <SelectValue placeholder="Select assistant role" />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem
            key={role.id}
            value={role.id}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                {React.createElement(role.icon, {
                  className: "h-4 w-4 text-primary"
                })}
              </div>
              <div className="flex flex-col min-w-[140px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{role.name}</span>
                  {role.badge && (
                    <Badge variant="secondary" className="h-5">
                      {role.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {role.description}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleSelector; 