// src/pages/LandingPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import withPageLoader from '@/components/hoc/withPageLoader';

// Hero
import HeroSection from '@/components/landing/hero';

// Features (now from the new features folder)
import FeaturesSection from '@/components/landing/features';

// Other landing sections
import RoleBasedSolutions from '@/components/landing/RoleBasedSolutions';
import HowItWorksSection  from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection         from '@/components/landing/CTASection';
import Footer             from '@/components/landing/Footer';

// Stagger container for top‐level page transitions
import { staggerContainer } from '@/components/landing/animations';

const LandingPage = () => {
  return (
    <motion.div
      className="flex flex-col items-center text-foreground overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <HeroSection />
        <FeaturesSection />
        <RoleBasedSolutions />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default withPageLoader(LandingPage);
