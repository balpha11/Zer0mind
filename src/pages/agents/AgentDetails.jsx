import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Bot, Brain, Users, Calculator, Briefcase, 
  Scale, Code, LineChart, MessageSquare, Shield, 
  BookOpen, PieChart, Zap, ArrowLeft, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import withPageLoader from '@/components/hoc/withPageLoader';

// Import agents from AgentDirectory
import { agents } from './AgentDirectory';

const AgentDetails = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  
  // Find the agent from the imported array
  const agent = agents.find(a => a.id === agentId);

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Agent not found</h2>
          <Button onClick={() => navigate('/agents')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-to-b from-background via-background to-card/10">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-8"
          onClick={() => navigate('/agents')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mr-6">
                  {agent.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{agent.name}</h1>
                  <Badge variant={agent.available === 'Pro' ? 'default' : 'secondary'}>
                    {agent.available} Plan
                  </Badge>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                {agent.longDescription}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Category</h3>
                  <p className="text-muted-foreground">{agent.category}</p>
                </div>
              </div>
            </motion.div>

            {/* Capabilities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Capabilities</h2>
              <div className="grid gap-4">
                {agent.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-3 mt-1" />
                    <p className="text-muted-foreground">{capability}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Use Cases Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Use Cases</h2>
              <div className="grid gap-4">
                {agent.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3" />
                    <p className="text-muted-foreground">{useCase}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Get Started</h3>
              {agent.available === 'Free' ? (
                <>
                  <p className="text-muted-foreground mb-4">
                    This agent is available in our Free plan. Start using it right away!
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/signup">Start Using Now</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">
                    This agent is available in our Pro plan. Upgrade to access its features.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/pricing">Upgrade to Pro</Link>
                  </Button>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {agent.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPageLoader(AgentDetails); 