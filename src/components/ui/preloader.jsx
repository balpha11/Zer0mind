import { motion } from 'framer-motion';
import React from 'react';

const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="relative">
        {/* Outer rotating circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary"
        />
        
        {/* Inner pulse effect with logo */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img 
            src="/assets/Zeromind.png" 
            alt="Zeromind Logo" 
            className="w-12 h-12 object-contain"
          />
        </motion.div>
      </div>

      {/* Loading text with gradient */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute mt-24 text-lg font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Loading Zer0Mind...
      </motion.p>

      {/* Animated dots */}
      <div className="absolute mt-36 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Preloader; 