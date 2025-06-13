// src/components/landing/features/FeatureCard.jsx

import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ feature, variants }) => (
  <motion.div
    variants={variants}
    className="group relative bg-card/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 overflow-hidden
               flex flex-col aspect-square"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${feature.gradient}`}
    />
    <div
      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0 flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}
    >
      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
    </div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-primary transition-colors">
      {feature.title}
    </h3>
    <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors flex-grow">
      {feature.description}
    </p>
  </motion.div>
);

export default FeatureCard;
