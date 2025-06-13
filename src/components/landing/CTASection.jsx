import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ChatInput from '@/components/ChatInput';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-center">
            Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Supercharge</span> Your Startup?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto text-center px-4">
            Stop guessing, start growing. Let Zer0Mind AI be your guide to success.
            Try our intelligent chat assistant now.
          </p>
          <div className="max-w-xl mx-auto mb-6 sm:mb-8 px-4">
            <ChatInput 
              isStatic={true} 
              placeholder="Ask: How can I find product-market fit?"
            />
          </div>
          <div className="text-center">
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-primary/40 transition-shadow"
            >
              <Link to="/chat">
                Chat with Copilot AI <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
