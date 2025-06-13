import { motion } from 'framer-motion';
import { Rocket, Target, Users, Award, Lightbulb, Zap } from 'lucide-react';
import React from 'react';
import withPageLoader from '@/components/hoc/withPageLoader';

const AboutPage = () => {
  const features = [
    {
      icon: <Target />,
      title: 'Our Mission',
      description: 'To empower entrepreneurs and startups with AI-driven tools and insights that accelerate their journey from idea to success.'
    },
    {
      icon: <Lightbulb />,
      title: 'Our Vision',
      description: 'To become the world\'s leading AI-powered startup companion, making entrepreneurship more accessible and successful for everyone.'
    },
    {
      icon: <Zap />,
      title: 'Our Impact',
      description: 'Helping thousands of founders transform their ideas into thriving businesses through innovative AI solutions.'
    }
  ];

  const stats = [
    { number: '10k+', label: 'Startups Helped' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'AI Support' },
    { number: '50+', label: 'Countries' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Former startup founder with 15 years of experience in AI and entrepreneurship.'
    },
    {
      name: 'Dr. James Wilson',
      role: 'Chief AI Officer',
      bio: 'PhD in Machine Learning, leading our AI innovation and development.'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Head of Operations',
      bio: 'Startup operations expert with experience scaling multiple companies.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-block p-2 px-4 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
              About Zer0Mind
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Revolutionizing <span className="text-gradient-purple-blue">Startup Success</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to transform how startups are built, making entrepreneurship more accessible 
              and successful through the power of artificial intelligence.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {React.cloneElement(feature.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Our diverse team of experts is passionate about helping entrepreneurs succeed.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Users size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <div className="text-primary font-medium mb-3">{member.role}</div>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default withPageLoader(AboutPage); 