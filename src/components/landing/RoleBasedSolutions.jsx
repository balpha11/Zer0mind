import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Code, LineChart, MessageSquare, 
  PieChart, Brain, Shield, Briefcase 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
  {
    icon: Users,
    title: "Founders / C-Suite",
    description: "Strategic planning, fundraising support, and executive decision making",
    features: [
      "Strategic planning assistant",
      "Fundraising pitch generator",
      "Competitor intelligence",
      "Executive summaries"
    ],
    gradient: "from-blue-500 to-purple-500"
  },
  {
    icon: Briefcase,
    title: "Sales Team",
    description: "Enhance sales processes and customer relationships",
    features: [
      "Lead qualification & scoring",
      "Follow-up automation",
      "Pipeline analytics",
      "Proposal generation"
    ],
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: LineChart,
    title: "Marketing Team",
    description: "Optimize campaigns and content creation",
    features: [
      "Content generation",
      "SEO optimization",
      "Social media management",
      "Campaign analytics"
    ],
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Code,
    title: "Product & Engineering",
    description: "Streamline development and product management",
    features: [
      "Code review assistance",
      "Technical documentation",
      "Bug tracking",
      "Feature prioritization"
    ],
    gradient: "from-purple-500 to-pink-500"
  }
];

const RoleCard = ({ role, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-card/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient background */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        `bg-gradient-to-br ${role.gradient}`
      )} />

      {/* Icon with gradient background */}
      <div className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 relative",
        "bg-gradient-to-br group-hover:scale-110 transition-transform duration-300",
        role.gradient
      )}>
        <role.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-primary transition-colors">{role.title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{role.description}</p>
      
      <ul className="space-y-2 sm:space-y-3">
        {role.features.map((feature, idx) => (
          <motion.li 
            key={idx} 
            className="flex items-center text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index * 0.1) + (idx * 0.1) }}
          >
            <motion.div 
              className={cn(
                "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-2",
                `bg-gradient-to-r ${role.gradient}`
              )}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: idx * 0.2,
              }}
            />
            {feature}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const RoleBasedSolutions = () => {
  return (
    <section id="solutions" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Tailored Solutions for Every Role
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover how Zer0Mind AI empowers different roles in your organization with specialized AI solutions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {roles.map((role, index) => (
            <RoleCard key={index} role={role} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleBasedSolutions; 