import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import React from 'react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal information (name, email, contact details)',
        'Usage data and analytics',
        'Device and browser information',
        'Cookies and tracking technologies',
        'AI interaction data and preferences'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To provide and improve our AI services',
        'To personalize your experience',
        'To communicate with you about our services',
        'To ensure platform security and prevent fraud',
        'To comply with legal obligations'
      ]
    },
    {
      title: 'Data Protection',
      content: [
        'Industry-standard encryption protocols',
        'Regular security audits and updates',
        'Strict access controls and authentication',
        'Data backup and recovery procedures',
        'Compliance with GDPR and other regulations'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'Access your personal data',
        'Request data correction or deletion',
        'Opt-out of marketing communications',
        'Data portability',
        'Withdraw consent at any time'
      ]
    }
  ];

  const lastUpdated = 'January 1, 2024';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="prose prose-gray dark:prose-invert max-w-none"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mb-8">
            <p className="text-muted-foreground mb-6">
              This Privacy Policy describes how Zer0Mind ("we," "our," or "us") collects, uses, and protects 
              your personal information when you use our AI-powered startup services and website.
            </p>
            <p className="text-sm text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">{section.title}</h2>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our Privacy Policy or how we handle your personal information, 
              please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Email: privacy@zer0mind.com</p>
              <p>Address: 123 Innovation Street, Tech Valley, CA 94025</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 