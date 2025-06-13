import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  FileText,
  Calculator,
  Wrench,
  Users,
  MessageCircle,
  BarChart2,
  Briefcase,
  ShieldCheck,
  Globe,
  Bot,
  BookOpenCheck,
  ClipboardList,
  BrainCog,
  Settings2
} from 'lucide-react';
import withPageLoader from '@/components/hoc/withPageLoader';

const FeatureCard = ({ title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      className="p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/40 backdrop-blur-sm"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.15 }}
      viewport={{ once: true }}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

const FeaturesPage = () => {
  const features = [
    {
      title: 'AI-Powered Assistant',
      description: 'An intelligent agent that helps automate, answer, and execute across domains.',
      icon: <Bot className="w-6 h-6 text-primary" />
    },
    {
      title: 'Rule-Based, Retrieval & Generative AI',
      description: 'Combines rule flows, search answers, and generative reasoning in one assistant.',
      icon: <BrainCog className="w-6 h-6 text-primary" />
    },
    {
      title: 'Multi-Agent Collaboration',
      description: 'Virtual agents like CEO, CFO, CTO, and more collaborate to fulfill user intents.',
      icon: <Users className="w-6 h-6 text-primary" />
    },
    {
      title: 'Natural Language Understanding',
      description: 'Understands user inputs with intent detection and entity extraction.',
      icon: <Settings2 className="w-6 h-6 text-primary" />
    },
    {
      title: 'Hosted & Custom Tools',
      description: 'Integrate search, email, code, tax, finance, and API tools into the bot flow.',
      icon: <Wrench className="w-6 h-6 text-primary" />
    },
    {
      title: 'Contextual Dialogue Management',
      description: 'Tracks conversation history and handles multi-turn dialogue fluidly.',
      icon: <ClipboardList className="w-6 h-6 text-primary" />
    },
    {
      title: 'Analytics & Reporting',
      description: 'Virtual analysts generate business insights, dashboards, and forecasts.',
      icon: <BarChart2 className="w-6 h-6 text-primary" />
    },
    {
      title: 'Legal & Healthcare Agents',
      description: 'Assistants for legal drafting, compliance, triage, and document review.',
      icon: <ShieldCheck className="w-6 h-6 text-primary" />
    },
    {
      title: 'Education & Tutoring',
      description: 'Interactive tutoring, study aid, and course navigation assistants.',
      icon: <BookOpenCheck className="w-6 h-6 text-primary" />
    },
    {
      title: 'E-commerce & Lead Generation',
      description: 'Guide buyers, recover carts, personalize offers, and capture leads.',
      icon: <Globe className="w-6 h-6 text-primary" />
    },
    {
      title: 'Business Automation',
      description: 'Trigger workflows, schedule meetings, fetch data, and automate ops.',
      icon: <Calculator className="w-6 h-6 text-primary" />
    },
    {
      title: 'Security & Ethics',
      description: 'Built-in privacy, fallback, human handoff, logging, and safety protocols.',
      icon: <ShieldCheck className="w-6 h-6 text-primary" />
    },
    {
      title: 'OpenAI Agent SDK Architecture',
      description: 'Powered by multi-agent tools, memory, orchestrators, and retrievers.',
      icon: <Briefcase className="w-6 h-6 text-primary" />
    },
    {
      title: 'Chat Anywhere: Web, App, Slack',
      description: 'Unified interface across chat, mobile, APIs, and business tools.',
      icon: <MessageCircle className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Zer0Mind AI
            <br />
            <span className="text-gradient-purple-blue">Your Business & Knowledge Assistant</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl">
            Power your startup, operations, and workflows with intelligent multi-agent AI powered by tools, chat, and execution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="/chat"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            Launch Zer0Mind
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default withPageLoader(FeaturesPage);
