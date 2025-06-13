import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Search, Brain, Users, Calculator, Briefcase, 
  Scale, Code, LineChart, MessageSquare, Shield, 
  BookOpen, PieChart, Zap, Paintbrush, Target,
  UserCog, Building, Coins, UserPlus, Megaphone,
  BarChart, UserCheck, Share2, BarChart2,
  Route, ClipboardList, TestTube, Terminal, FileText,
  MessageCircle, GraduationCap, FileCheck,
  CalendarClock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import withPageLoader from '@/components/hoc/withPageLoader';

// Export the agents array
export const agents = [
  {
    id: 'startup-validator',
    name: 'Startup Idea Validator',
    icon: <Brain className="w-6 h-6" />,
    description: 'Evaluate and validate startup ideas with market insights and feasibility analysis.',
    longDescription: 'Our Startup Idea Validator uses advanced AI to analyze your business concept from multiple angles. It combines market research, competitor analysis, and industry trends to provide comprehensive validation of your startup idea.',
    category: 'Strategy',
    features: [
      'Idea validation framework',
      'Market size estimation',
      'Competitor analysis',
      'Risk assessment'
    ],
    capabilities: [
      'Analyze market potential and opportunity size',
      'Identify key competitors and their strengths/weaknesses',
      'Evaluate business model viability',
      'Suggest potential pivot opportunities',
      'Assess market timing and entry strategy',
      'Identify key success factors and risks'
    ],
    useCases: [
      'Validating new startup ideas',
      'Exploring market opportunities',
      'Analyzing competition',
      'Risk assessment',
      'Pivot strategy evaluation'
    ],
    available: 'Free'
  },
  {
    id: 'market-researcher',
    name: 'Market Research Analyst',
    icon: <PieChart className="w-6 h-6" />,
    description: 'Deep dive into market trends, customer segments, and industry analysis.',
    longDescription: 'The Market Research Analyst leverages AI to gather, analyze, and synthesize market data from multiple sources. It provides actionable insights about market trends, customer behavior, and competitive landscapes.',
    category: 'Research',
    features: [
      'Market trend analysis',
      'Customer segmentation',
      'Industry reports',
      'Data visualization'
    ],
    capabilities: [
      'Analyze market size and growth potential',
      'Identify target customer segments',
      'Track industry trends and developments',
      'Generate comprehensive market reports',
      'Perform competitive analysis',
      'Create data visualizations'
    ],
    useCases: [
      'Market opportunity assessment',
      'Customer persona development',
      'Competitive landscape analysis',
      'Industry trend tracking',
      'Market entry strategy'
    ],
    available: 'Free'
  },
  {
    id: 'revenue-forecaster',
    name: 'Revenue Model Forecaster',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Project revenue streams and financial models for your startup.',
    longDescription: 'The Revenue Model Forecaster combines historical data analysis with AI-powered predictive modeling to create accurate revenue projections and financial forecasts for your business.',
    category: 'Finance',
    features: [
      'Revenue projections',
      'Pricing strategy',
      'Break-even analysis',
      'Cash flow modeling'
    ],
    capabilities: [
      'Create detailed revenue forecasts',
      'Analyze pricing strategies',
      'Calculate break-even points',
      'Model different revenue scenarios',
      'Project cash flow requirements',
      'Assess financial viability'
    ],
    useCases: [
      'Financial planning',
      'Investor presentations',
      'Business model validation',
      'Budget planning',
      'Growth strategy development'
    ],
    available: 'Free'
  },
  {
    id: 'mvp-planner',
    name: 'MVP Planner',
    icon: <Code className="w-6 h-6" />,
    description: 'Plan and scope your minimum viable product with technical insights.',
    longDescription: 'The MVP Planner helps you define and prioritize features for your minimum viable product. It combines technical expertise with market insights to create a balanced and achievable MVP roadmap.',
    category: 'Product',
    features: [
      'Feature prioritization',
      'Development roadmap',
      'Resource planning',
      'Technical stack advice'
    ],
    capabilities: [
      'Define core product features',
      'Create development timelines',
      'Estimate resource requirements',
      'Recommend technical solutions',
      'Identify potential challenges',
      'Plan testing strategies'
    ],
    useCases: [
      'MVP definition',
      'Product roadmap planning',
      'Technical architecture',
      'Resource allocation',
      'Development strategy'
    ],
    available: 'Free'
  },
  {
    id: 'pitch-generator',
    name: 'Pitch Deck Generator',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Create compelling pitch decks and investor presentations.',
    longDescription: 'The Pitch Deck Generator helps you create professional and compelling investor presentations. It combines storytelling with data visualization to effectively communicate your business vision and potential.',
    category: 'Fundraising',
    features: [
      'Pitch deck templates',
      'Story structuring',
      'Visual design suggestions',
      'Investor targeting'
    ],
    capabilities: [
      'Generate professional pitch decks',
      'Structure compelling narratives',
      'Create impactful visuals',
      'Tailor content for investors',
      'Highlight key metrics',
      'Suggest presentation strategies'
    ],
    useCases: [
      'Investor presentations',
      'Funding rounds',
      'Partner pitches',
      'Sales presentations',
      'Conference talks'
    ],
    available: 'Free'
  },
  {
    id: 'virtual-ceo',
    name: 'Virtual CEO Advisor',
    icon: <Building className="w-6 h-6" />,
    description: 'Strategic guidance and executive decision-making support.',
    longDescription: 'The Virtual CEO Advisor provides comprehensive strategic leadership guidance, helping with business growth initiatives, risk analysis, and vision setting. It combines data-driven insights with industry best practices.',
    category: 'Executive',
    features: [
      'Strategic planning',
      'Growth initiatives',
      'Risk analysis',
      'Vision setting'
    ],
    capabilities: [
      'Develop business strategies',
      'Analyze market opportunities',
      'Assess business risks',
      'Set organizational vision',
      'Guide strategic decisions',
      'Monitor business performance'
    ],
    useCases: [
      'Strategic planning sessions',
      'Business growth planning',
      'Risk management',
      'Vision development',
      'Executive decision support'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-coo',
    name: 'Virtual COO',
    icon: <UserCog className="w-6 h-6" />,
    description: 'Optimizes internal operations and workflow management.',
    longDescription: 'The Virtual COO helps optimize internal operations, streamline workflows, and improve organizational efficiency. It provides data-driven recommendations for resource allocation and process automation.',
    category: 'Executive',
    features: [
      'Workflow optimization',
      'Resource planning',
      'Process automation',
      'Operational analytics'
    ],
    capabilities: [
      'Optimize operations',
      'Manage workflows',
      'Plan resources',
      'Suggest automation',
      'Track efficiency metrics',
      'Improve processes'
    ],
    useCases: [
      'Operations optimization',
      'Resource allocation',
      'Process improvement',
      'Workflow automation',
      'Efficiency analysis'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-cfo',
    name: 'Virtual CFO',
    icon: <Coins className="w-6 h-6" />,
    description: 'Financial planning and strategy alignment.',
    longDescription: 'The Virtual CFO provides comprehensive financial management support, handling budgeting, forecasting, and financial strategy. It helps align financial decisions with business objectives.',
    category: 'Executive',
    features: [
      'Financial planning',
      'Budget management',
      'Forecasting',
      'Expense analysis'
    ],
    capabilities: [
      'Create budgets',
      'Financial forecasting',
      'Analyze expenses',
      'Strategic planning',
      'Financial reporting',
      'Investment analysis'
    ],
    useCases: [
      'Budget planning',
      'Financial strategy',
      'Expense management',
      'Investment decisions',
      'Financial reporting'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-chro',
    name: 'Virtual CHRO',
    icon: <UserPlus className="w-6 h-6" />,
    description: 'HR strategy and employee well-being management.',
    longDescription: 'The Virtual CHRO helps manage HR strategies, including hiring, performance reviews, and employee well-being. It ensures compliance with HR regulations and best practices.',
    category: 'Executive',
    features: [
      'Hiring strategy',
      'Performance reviews',
      'Employee well-being',
      'HR compliance'
    ],
    capabilities: [
      'Design HR strategies',
      'Manage performance',
      'Monitor well-being',
      'Ensure compliance',
      'Development planning',
      'Culture building'
    ],
    useCases: [
      'HR strategy planning',
      'Performance management',
      'Employee engagement',
      'Compliance monitoring',
      'Culture development'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-cmo',
    name: 'Virtual CMO',
    icon: <Megaphone className="w-6 h-6" />,
    description: 'Marketing strategy and brand management.',
    longDescription: 'The Virtual CMO helps design and execute marketing strategies, manage brand identity, and optimize campaign performance. It provides data-driven insights for marketing decisions.',
    category: 'Executive',
    features: [
      'Marketing strategy',
      'Brand management',
      'Campaign oversight',
      'Performance analytics'
    ],
    capabilities: [
      'Design marketing plans',
      'Manage campaigns',
      'Oversee branding',
      'Analyze performance',
      'Guide strategy',
      'Market positioning'
    ],
    useCases: [
      'Marketing planning',
      'Brand strategy',
      'Campaign management',
      'Market analysis',
      'Performance optimization'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-cto',
    name: 'Virtual CTO',
    icon: <Code className="w-6 h-6" />,
    description: 'Technical architecture and development strategy guidance.',
    longDescription: 'The Virtual CTO provides expert technical guidance and helps make critical technology decisions. It assists in choosing the right tech stack, planning architecture, and ensuring scalability.',
    category: 'Technology',
    features: [
      'Tech stack selection',
      'Architecture planning',
      'Security guidance',
      'Scalability planning'
    ],
    capabilities: [
      'Evaluate technology options',
      'Design system architecture',
      'Plan for scalability',
      'Assess security needs',
      'Guide development teams',
      'Optimize technical processes'
    ],
    useCases: [
      'Technology selection',
      'Architecture design',
      'Security planning',
      'Team structure',
      'Technical roadmap'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-legal',
    name: 'Virtual Legal Advisor',
    icon: <Scale className="w-6 h-6" />,
    description: 'Legal guidance and compliance support for startups.',
    longDescription: 'The Virtual Legal Advisor helps navigate common legal challenges faced by startups. It provides guidance on compliance, contracts, and intellectual property protection.',
    category: 'Legal',
    features: [
      'Contract review',
      'Compliance checks',
      'Legal documentation',
      'IP protection'
    ],
    capabilities: [
      'Review legal documents',
      'Ensure compliance',
      'Protect intellectual property',
      'Draft agreements',
      'Manage legal risks',
      'Guide regulatory compliance'
    ],
    useCases: [
      'Contract management',
      'Compliance monitoring',
      'IP strategy',
      'Risk management',
      'Legal documentation'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-accountant',
    name: 'Virtual Accountant',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Financial management and accounting support.',
    longDescription: 'The Virtual Accountant helps manage financial operations and provides accounting guidance. It assists with budgeting, expense tracking, and financial reporting.',
    category: 'Finance',
    features: [
      'Financial planning',
      'Tax guidance',
      'Expense tracking',
      'Budget management'
    ],
    capabilities: [
      'Manage financial records',
      'Track expenses',
      'Plan budgets',
      'Generate financial reports',
      'Provide tax guidance',
      'Monitor cash flow'
    ],
    useCases: [
      'Financial management',
      'Expense tracking',
      'Budget planning',
      'Tax preparation',
      'Financial reporting'
    ],
    available: 'Pro'
  },
  {
    id: 'virtual-dev',
    name: 'Virtual Development Team',
    icon: <Code className="w-6 h-6" />,
    description: 'Technical development and coding guidance.',
    longDescription: 'The Virtual Development Team provides technical guidance and best practices for software development. It helps with code review, architecture decisions, and development processes.',
    category: 'Development',
    features: [
      'Code review',
      'Best practices',
      'Problem solving',
      'Architecture review'
    ],
    capabilities: [
      'Review code quality',
      'Suggest improvements',
      'Solve technical issues',
      'Guide architecture decisions',
      'Implement best practices',
      'Optimize development'
    ],
    useCases: [
      'Code quality',
      'Technical guidance',
      'Problem solving',
      'Process improvement',
      'Team development'
    ],
    available: 'Pro'
  },
  {
    id: 'business-model-designer',
    name: 'Business Model Designer',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Design and validate innovative business models for your startup.',
    longDescription: 'The Business Model Designer helps you create and iterate on your business model using proven frameworks and AI-driven insights. It analyzes market trends, customer needs, and revenue streams to build a sustainable business model.',
    category: 'Strategy',
    features: [
      'Business model canvas',
      'Revenue stream analysis',
      'Value proposition design',
      'Cost structure planning'
    ],
    capabilities: [
      'Generate business model options',
      'Analyze revenue streams',
      'Design value propositions',
      'Map customer segments',
      'Plan cost structures',
      'Identify key partnerships'
    ],
    useCases: [
      'Business model innovation',
      'Startup planning',
      'Pivot strategy',
      'Revenue model design',
      'Market entry planning'
    ],
    available: 'Free'
  },
  {
    id: 'brand-generator',
    name: 'Brand Name & Logo Generator',
    icon: <Paintbrush className="w-6 h-6" />,
    description: 'Create unique brand names and visual identities for your business.',
    longDescription: 'The Brand Name & Logo Generator combines AI creativity with branding principles to help you develop a memorable and effective brand identity. It generates unique names, checks availability, and creates matching visual elements.',
    category: 'Branding',
    features: [
      'Name generation',
      'Domain availability check',
      'Logo design concepts',
      'Color palette selection'
    ],
    capabilities: [
      'Generate brand name ideas',
      'Check domain availability',
      'Create logo concepts',
      'Suggest color schemes',
      'Design brand guidelines',
      'Ensure trademark compliance'
    ],
    useCases: [
      'Brand identity creation',
      'Rebranding projects',
      'Product naming',
      'Visual identity design',
      'Brand guidelines development'
    ],
    available: 'Free'
  },
  {
    id: 'marketing-strategist',
    name: 'Digital Marketing Strategist',
    icon: <Target className="w-6 h-6" />,
    description: 'Develop comprehensive digital marketing strategies for growth.',
    longDescription: 'The Digital Marketing Strategist helps create and execute effective marketing campaigns across digital channels. It provides data-driven recommendations for channel selection, content strategy, and budget allocation.',
    category: 'Marketing',
    features: [
      'Channel strategy',
      'Content planning',
      'Budget optimization',
      'Performance tracking'
    ],
    capabilities: [
      'Plan marketing campaigns',
      'Optimize channel mix',
      'Create content calendars',
      'Set marketing budgets',
      'Track campaign performance',
      'Generate marketing insights'
    ],
    useCases: [
      'Marketing strategy',
      'Campaign planning',
      'Content strategy',
      'Performance marketing',
      'Growth marketing'
    ],
    available: 'Free'
  },
  {
    id: 'sales-manager',
    name: 'Sales Manager Bot',
    icon: <BarChart className="w-6 h-6" />,
    description: 'Sales performance tracking and team coaching.',
    longDescription: 'The Sales Manager Bot helps track sales pipeline, analyze performance metrics, and provide real-time coaching to sales representatives.',
    category: 'Sales',
    features: [
      'Pipeline tracking',
      'Performance analytics',
      'Real-time coaching',
      'Sales forecasting'
    ],
    capabilities: [
      'Track sales pipeline',
      'Analyze performance',
      'Coach sales reps',
      'Forecast sales',
      'Optimize processes',
      'Generate reports'
    ],
    useCases: [
      'Sales management',
      'Team coaching',
      'Performance tracking',
      'Pipeline optimization',
      'Forecasting'
    ],
    available: 'Pro'
  },
  {
    id: 'lead-generator',
    name: 'Lead Generation Agent',
    icon: <UserCheck className="w-6 h-6" />,
    description: 'Prospect identification and outreach automation.',
    longDescription: 'The Lead Generation Agent helps identify qualified prospects, create personalized outreach messages, and maintain CRM data accuracy.',
    category: 'Sales',
    features: [
      'Prospect identification',
      'Outreach automation',
      'CRM integration',
      'Lead scoring'
    ],
    capabilities: [
      'Find prospects',
      'Write outreach',
      'Update CRM',
      'Score leads',
      'Track engagement',
      'Automate follow-ups'
    ],
    useCases: [
      'Lead generation',
      'Sales outreach',
      'CRM management',
      'Lead nurturing',
      'Pipeline building'
    ],
    available: 'Pro'
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    icon: <Share2 className="w-6 h-6" />,
    description: 'Social media content and engagement management.',
    longDescription: 'The Social Media Manager helps schedule posts, manage engagement, and optimize social media presence across platforms.',
    category: 'Marketing',
    features: [
      'Content scheduling',
      'Engagement management',
      'Analytics tracking',
      'Content planning'
    ],
    capabilities: [
      'Schedule posts',
      'Manage engagement',
      'Track analytics',
      'Plan content',
      'Monitor trends',
      'Generate reports'
    ],
    useCases: [
      'Social media management',
      'Content strategy',
      'Engagement optimization',
      'Performance tracking',
      'Trend analysis'
    ],
    available: 'Pro'
  },
  {
         id: 'ad-optimizer',
     name: 'Ad Campaign Optimizer',
     icon: <BarChart2 className="w-6 h-6" />,
    description: 'Digital advertising campaign optimization.',
    longDescription: 'The Ad Campaign Optimizer helps create, test, and optimize advertising campaigns across multiple platforms using real-time performance data.',
    category: 'Marketing',
    features: [
      'Campaign creation',
      'A/B testing',
      'Performance optimization',
      'Budget management'
    ],
    capabilities: [
      'Create campaigns',
      'Test variations',
      'Optimize performance',
      'Manage budgets',
      'Track metrics',
      'Generate insights'
    ],
    useCases: [
      'Ad optimization',
      'Campaign testing',
      'Performance marketing',
      'Budget optimization',
      'ROI improvement'
    ],
    available: 'Pro'
  },
  {
    id: 'journey-analyst',
    name: 'Customer Journey Analyst',
    icon: <Route className="w-6 h-6" />,
    description: 'Customer experience and journey optimization.',
    longDescription: 'The Customer Journey Analyst helps map and optimize customer journeys, identify improvement opportunities, and suggest retention strategies.',
    category: 'Marketing',
    features: [
      'Journey mapping',
      'Drop-off analysis',
      'UX improvements',
      'Retargeting strategy'
    ],
    capabilities: [
      'Map journeys',
      'Analyze behavior',
      'Identify issues',
      'Suggest improvements',
      'Track metrics',
      'Optimize experiences'
    ],
    useCases: [
      'Journey optimization',
      'UX improvement',
      'Retention strategy',
      'Conversion optimization',
      'Customer analysis'
    ],
    available: 'Pro'
  },
  {
    id: 'product-manager',
    name: 'Virtual Product Manager',
    icon: <ClipboardList className="w-6 h-6" />,
    description: 'Product development and feature management.',
    longDescription: 'The Virtual Product Manager helps gather and analyze feedback, prioritize features, and create detailed product requirements documents.',
    category: 'Product',
    features: [
      'Feedback analysis',
      'Feature prioritization',
      'PRD creation',
      'Roadmap planning'
    ],
    capabilities: [
      'Gather feedback',
      'Prioritize features',
      'Write PRDs',
      'Plan roadmaps',
      'Track progress',
      'Manage backlog'
    ],
    useCases: [
      'Product planning',
      'Feature management',
      'Documentation',
      'Roadmap development',
      'Feedback analysis'
    ],
    available: 'Pro'
  },
  {
    id: 'qa-assistant',
    name: 'QA Assistant Agent',
    icon: <TestTube className="w-6 h-6" />,
    description: 'Quality assurance and testing automation.',
    longDescription: 'The QA Assistant Agent helps automate testing processes, identify bugs, and maintain detailed test documentation.',
    category: 'Technology',
    features: [
      'Automated testing',
      'Bug tracking',
      'Test documentation',
      'Quality metrics'
    ],
    capabilities: [
      'Run tests',
      'Log bugs',
      'Document issues',
      'Track quality',
      'Suggest fixes',
      'Maintain coverage'
    ],
    useCases: [
      'Quality assurance',
      'Test automation',
      'Bug tracking',
      'Documentation',
      'Quality monitoring'
    ],
    available: 'Pro'
  },
  {
    id: 'devops-assistant',
    name: 'DevOps Assistant',
    icon: <Terminal className="w-6 h-6" />,
    description: 'Infrastructure and deployment management.',
    longDescription: 'The DevOps Assistant helps monitor deployments, resolve infrastructure issues, and maintain CI/CD pipelines.',
    category: 'Technology',
    features: [
      'Deployment monitoring',
      'Infrastructure management',
      'CI/CD optimization',
      'Issue resolution'
    ],
    capabilities: [
      'Monitor systems',
      'Resolve issues',
      'Optimize pipelines',
      'Manage infrastructure',
      'Track metrics',
      'Automate tasks'
    ],
    useCases: [
      'DevOps management',
      'Infrastructure monitoring',
      'Pipeline optimization',
      'Issue resolution',
      'System maintenance'
    ],
    available: 'Pro'
  },
  {
    id: 'tech-documentation',
    name: 'Technical Documentation Bot',
    icon: <FileText className="w-6 h-6" />,
    description: 'Technical documentation management.',
    longDescription: 'The Technical Documentation Bot helps create and maintain comprehensive technical documentation for APIs, systems, and user guides.',
    category: 'Technology',
    features: [
      'Documentation writing',
      'API documentation',
      'User guide creation',
      'Content maintenance'
    ],
    capabilities: [
      'Write docs',
      'Update content',
      'Generate guides',
      'Maintain APIs',
      'Track versions',
      'Ensure accuracy'
    ],
    useCases: [
      'Technical writing',
      'API documentation',
      'User guides',
      'System documentation',
      'Content management'
    ],
    available: 'Pro'
  },
  {
    id: 'feedback-analyzer',
    name: 'User Feedback Analyzer',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'Customer feedback analysis and insights.',
    longDescription: 'The User Feedback Analyzer helps aggregate and analyze customer feedback from multiple sources to identify trends and priorities.',
    category: 'Product',
    features: [
      'Feedback aggregation',
      'Trend analysis',
      'Feature prioritization',
      'Sentiment tracking'
    ],
    capabilities: [
      'Analyze feedback',
      'Identify trends',
      'Track sentiment',
      'Prioritize features',
      'Generate reports',
      'Surface insights'
    ],
    useCases: [
      'Feedback analysis',
      'Feature planning',
      'Customer insights',
      'Product improvement',
      'Sentiment tracking'
    ],
    available: 'Pro'
  },
  {
         id: 'recruitment-agent',
     name: 'Recruitment Agent',
     icon: <Search className="w-6 h-6" />,
    description: 'Recruitment process automation and management.',
    longDescription: 'The Recruitment Agent helps streamline the hiring process by managing candidate screening, scheduling, and skill assessment.',
    category: 'HR',
    features: [
      'Candidate screening',
      'Interview scheduling',
      'Skill assessment',
      'Process automation'
    ],
    capabilities: [
      'Screen candidates',
      'Schedule interviews',
      'Assess skills',
      'Track applications',
      'Manage pipeline',
      'Generate reports'
    ],
    useCases: [
      'Recruitment',
      'Hiring process',
      'Candidate screening',
      'Interview management',
      'Talent acquisition'
    ],
    available: 'Pro'
  },
  {
    id: 'onboarding-agent',
    name: 'Onboarding Agent',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Employee onboarding process management.',
    longDescription: 'The Onboarding Agent helps manage new employee onboarding by coordinating documentation, training, and orientation activities.',
    category: 'HR',
    features: [
      'Document management',
      'Training coordination',
      'Process tracking',
      'Resource provision'
    ],
    capabilities: [
      'Manage documents',
      'Coordinate training',
      'Track progress',
      'Provide resources',
      'Schedule activities',
      'Ensure compliance'
    ],
    useCases: [
      'Employee onboarding',
      'Training management',
      'Documentation',
      'Process tracking',
      'Resource management'
    ],
    available: 'Pro'
  },
  {
    id: 'compliance-manager',
    name: 'Policy & Compliance Manager',
    icon: <FileCheck className="w-6 h-6" />,
    description: 'Policy management and compliance monitoring.',
    longDescription: 'The Policy & Compliance Manager helps ensure organizational compliance with policies and regulations across different areas.',
    category: 'Legal',
    features: [
      'Policy management',
      'Compliance monitoring',
      'Update tracking',
      'Risk assessment'
    ],
    capabilities: [
      'Monitor compliance',
      'Update policies',
      'Track changes',
      'Assess risks',
      'Generate reports',
      'Maintain records'
    ],
    useCases: [
      'Policy management',
      'Compliance monitoring',
      'Risk assessment',
      'Regulation tracking',
      'Documentation'
    ],
    available: 'Pro'
  },
  {
    id: 'executive-assistant',
    name: 'Executive Assistant Bot',
    icon: <CalendarClock className="w-6 h-6" />,
    description: 'Administrative task management and scheduling.',
    longDescription: 'The Executive Assistant Bot helps manage schedules, coordinate meetings, and handle administrative tasks for leadership teams.',
    category: 'Admin',
    features: [
      'Schedule management',
      'Travel booking',
      'Meeting coordination',
      'Task tracking'
    ],
    capabilities: [
      'Manage schedules',
      'Book travel',
      'Coordinate meetings',
      'Track tasks',
      'Send reminders',
      'Prepare summaries'
    ],
    useCases: [
      'Schedule management',
      'Travel coordination',
      'Meeting organization',
      'Task tracking',
      'Administrative support'
    ],
    available: 'Pro'
  }
];

const AgentCard = ({ agent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-4">
          {agent.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
          <Badge variant={agent.available === 'Pro' ? 'default' : 'secondary'}>
            {agent.available} Plan
          </Badge>
        </div>
      </div>
    </div>
    
    <p className="text-muted-foreground mb-4">{agent.description}</p>
    
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground mb-2">Key Features:</h4>
      <ul className="space-y-1">
        {agent.features.map((feature, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>

    <Button 
      className="w-full mt-6" 
      variant={agent.available === 'Pro' ? 'default' : 'secondary'}
      asChild
    >
      <Link to={`/agents/${agent.id}`}>Learn More</Link>
    </Button>
  </motion.div>
);

const AgentDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(agents.map(agent => agent.category))];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            Meet Your <span className="text-gradient-purple-blue">AI Agents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our powerful AI agents designed to help you build, grow, and scale your startup.
          </p>
        </motion.div>

        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search agents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="min-w-[100px]"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} delay={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default withPageLoader(AgentDirectory); 