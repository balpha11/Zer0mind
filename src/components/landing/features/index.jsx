// src/components/landing/features/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { containerVariants, itemVariants } from './animations';
import { FEATURES } from './constants';
import { styles } from './styles';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => (
  <section id="features" className={styles.section}>
    {/* background sparkle */}
    <motion.div
      className="absolute inset-0 -z-10 opacity-30"
      animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
      transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)'
      }}
    />

    <div className="container mx-auto">
      {/* header */}
      <motion.div
        className={styles.headerWrapper}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.headerIconWrapper}
        >
          <div className={styles.headerIconInner}>
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
        </motion.div>

        <h2 className={styles.title}>
          Comprehensive Business Solutions
        </h2>
        <p className={styles.description}>
          Zer0Mind AI provides end-to-end support for your business growth journey with intelligent tools and insights.
        </p>
      </motion.div>

      {/* masonry container */}
      <motion.div
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 px-4"
        style={{ columnGap: '1.5rem' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {FEATURES.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="mb-6 break-inside-avoid"
          >
            <FeatureCard feature={feature} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
