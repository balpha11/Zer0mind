import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import React from 'react';

const TermsOfServicePage = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using Zer0Mind's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.`
    },
    {
      title: 'Service Description',
      content: `Zer0Mind provides AI-powered tools and services for startup development, including but not limited to idea validation, virtual team simulation, and business planning. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.`
    },
    {
      title: 'User Accounts',
      subsections: [
        {
          subtitle: 'Account Creation',
          content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.'
        },
        {
          subtitle: 'Account Security',
          content: 'You are solely responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breach.'
        }
      ]
    },
    {
      title: 'Intellectual Property',
      subsections: [
        {
          subtitle: 'Our Rights',
          content: 'All content, features, and functionality of Zer0Mind services are owned by us and protected by international copyright, trademark, and other intellectual property laws.'
        },
        {
          subtitle: 'User Content',
          content: 'You retain ownership of any content you submit through our services. By submitting content, you grant us a worldwide, non-exclusive license to use, reproduce, and distribute your content.'
        }
      ]
    },
    {
      title: 'Limitations of Liability',
      content: `To the maximum extent permitted by law, Zer0Mind shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.`
    },
    {
      title: 'Termination',
      content: `We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms of Service.`
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
            <Scale size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
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
              These Terms of Service ("Terms") govern your access to and use of Zer0Mind's website and services. 
              By using our services, you agree to these Terms.
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
                {section.content && (
                  <p className="text-muted-foreground mb-6">{section.content}</p>
                )}
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          {subsection.subtitle}
                        </h3>
                        <p className="text-muted-foreground">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Email: legal@zer0mind.com</p>
              <p>Address: 123 Innovation Street, Tech Valley, CA 94025</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 