import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart4,
  Code2,
  FileText,
  Lightbulb,
  MessageSquarePlus,
  PenTool,
  Rocket,
  Sparkles,
  Table,
  Target
} from 'lucide-react';
import React from 'react';

const QUICK_PROMPTS = [
  {
    icon: Rocket,
    title: "Startup Strategy",
    description: "Get advice on launching and growing your startup",
    prompts: [
      "Help me create a pitch deck for my startup",
      "What's the best way to validate my business idea?",
      "How should I price my SaaS product?"
    ]
  },
  {
    icon: Target,
    title: "Marketing & Growth",
    description: "Develop effective marketing strategies",
    prompts: [
      "Create a social media marketing plan",
      "How can I improve my website's conversion rate?",
      "Suggest content marketing ideas for my business"
    ]
  },
  {
    icon: Lightbulb,
    title: "Product Development",
    description: "Get insights on building better products",
    prompts: [
      "Help me create a product roadmap",
      "How can I improve my user onboarding?",
      "What metrics should I track for my product?"
    ]
  }
];

const CANVAS_TYPES = [
  { icon: Code2, name: "Code", description: "Write and edit code" },
  { icon: FileText, name: "Document", description: "Create documents" },
  { icon: Table, name: "Spreadsheet", description: "Work with data" },
  { icon: BarChart4, name: "Chart", description: "Visualize data" },
  { icon: PenTool, name: "Whiteboard", description: "Sketch ideas" }
];

const WelcomeScreen = ({ onPromptSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3">
          Welcome to Zer0Mind AI
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your intelligent business assistant. Get help with strategy, marketing, product development, and more.
        </p>
      </motion.div>

      {/* Quick Prompts */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {QUICK_PROMPTS.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="group relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {React.createElement(category.icon, {
                  className: "h-5 w-5 text-primary"
                })}
              </div>
              <div>
                <h3 className="font-semibold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              {category.prompts.map((prompt, promptIndex) => (
                <li key={promptIndex}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between group/prompt"
                    onClick={() => onPromptSelect(prompt)}
                  >
                    <span className="text-sm truncate">{prompt}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover/prompt:opacity-100 transition-opacity" />
                  </Button>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Canvas Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border bg-card/50 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Available Canvas Types</h2>
          <Badge variant="secondary" className="ml-2">New</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CANVAS_TYPES.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group p-4 rounded-xl border bg-card hover:shadow-md transition-shadow text-center"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                {React.createElement(type.icon, {
                  className: "h-6 w-6 text-primary"
                })}
              </div>
              <h3 className="font-medium mb-1">{type.name}</h3>
              <p className="text-xs text-muted-foreground">
                {type.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen; 