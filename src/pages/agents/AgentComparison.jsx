import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import withPageLoader from '@/components/hoc/withPageLoader';

// Import agents from AgentDirectory
import { agents } from './AgentDirectory';

const ComparisonTable = ({ selectedAgents }) => {
  // Get all unique feature categories from selected agents
  const categories = [
    'Basic Features',
    'Advanced Capabilities',
    'Integration Options',
    'Support & Training'
  ];

  const featuresByCategory = {
    'Basic Features': [
      'AI-Powered Analysis',
      'Custom Reports',
      'Data Export',
      'Real-time Updates'
    ],
    'Advanced Capabilities': [
      'Machine Learning Models',
      'Natural Language Processing',
      'Predictive Analytics',
      'Custom Workflows'
    ],
    'Integration Options': [
      'API Access',
      'Third-party Integrations',
      'Data Import/Export',
      'Webhook Support'
    ],
    'Support & Training': [
      'Documentation',
      'Email Support',
      'Live Chat',
      'Training Sessions'
    ]
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left bg-card/50 border-b border-border/50 min-w-[200px]"></th>
            {selectedAgents.map((agent) => (
              <th
                key={agent.id}
                className="p-4 text-center bg-card/50 border-b border-border/50 min-w-[200px]"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                    {agent.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{agent.name}</h3>
                  <Badge variant={agent.available === 'Pro' ? 'default' : 'secondary'} className="mt-1">
                    {agent.available} Plan
                  </Badge>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, categoryIndex) => (
            <React.Fragment key={category}>
              <tr>
                <td
                  colSpan={selectedAgents.length + 1}
                  className="bg-muted/50 p-2 font-semibold text-foreground"
                >
                  {category}
                </td>
              </tr>
              {featuresByCategory[category].map((feature, featureIndex) => (
                <tr key={feature} className="border-b border-border/50 last:border-0">
                  <td className="p-4 text-muted-foreground">{feature}</td>
                  {selectedAgents.map((agent) => (
                    <td key={agent.id} className="p-4 text-center">
                      {agent.available === 'Pro' || (agent.available === 'Free' && featureIndex < 2) ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AgentComparison = () => {
  const [selectedAgents, setSelectedAgents] = useState(agents.slice(0, 3));

  const handleAgentSelect = (agentId, index) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      const newSelectedAgents = [...selectedAgents];
      newSelectedAgents[index] = agent;
      setSelectedAgents(newSelectedAgents);
    }
  };

  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-to-b from-background via-background to-card/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Compare <span className="text-gradient-purple-blue">AI Agents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare our AI agents side by side to find the perfect combination for your needs.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <Select
                key={index}
                value={selectedAgents[index]?.id}
                onValueChange={(value) => handleAgentSelect(value, index)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent to compare" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
        >
          <ComparisonTable selectedAgents={selectedAgents} />
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-6">
            Ready to get started with our AI agents?
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">Start Free Trial</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default withPageLoader(AgentComparison); 