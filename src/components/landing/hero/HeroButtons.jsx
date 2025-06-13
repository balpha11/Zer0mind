// src/components/landing/hero/HeroButtons.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { containerVariants, itemVariants } from './animations';

const HeroButtons = () => (
  <motion.div
    className="flex flex-col sm:flex-row gap-4 justify-center px-4"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={itemVariants}>
      <Button
        size="lg"
        variant="outline"
        asChild
        className="w-full sm:w-auto shadow-sm hover:shadow-secondary/30 transition-all border-primary/20 hover:border-primary/40 backdrop-blur-sm"
      >
        <Link to="/#solutions">Explore Solutions</Link>
      </Button>
    </motion.div>
  </motion.div>
);

export default HeroButtons;
