// src/components/landing/hero/HeroFeatureCard.jsx

import React from 'react';

const HeroFeatureCard = ({ Icon, text }) => (
  <div className="flex items-center justify-center space-x-2 text-muted-foreground p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 ease-out">
    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
    <span className="text-sm sm:text-base">{text}</span>
  </div>
);

export default HeroFeatureCard;
