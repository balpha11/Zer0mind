import React from 'react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ quote, author, role, imageSrc, delay = 0 }) => (
  <motion.div
    className="bg-card p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: delay * 0.15 }}
  >
    <img 
      className="w-20 h-20 rounded-full mb-4 object-cover"
      alt={author}
      src={imageSrc} />
    <p className="text-muted-foreground italic mb-4">"{quote}"</p>
    <h4 className="font-semibold text-foreground">{author}</h4>
    <p className="text-sm text-primary">{role}</p>
  </motion.div>
);

export default TestimonialCard;
