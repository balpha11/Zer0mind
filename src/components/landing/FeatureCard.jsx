
import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    className="flex flex-col items-start p-6 bg-card rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay * 0.1 }}
    viewport={{ once: true }}
  >
    <div className="p-3 mb-4 rounded-lg bg-primary/10 text-primary">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default FeatureCard;
