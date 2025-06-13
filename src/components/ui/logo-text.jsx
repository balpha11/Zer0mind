import React from 'react';
import { motion } from 'framer-motion';

const LogoText = ({ className = '', showIcon = true, size = 'default' }) => {
  const textSizes = {
    small: 'text-2xl',
    default: 'text-3xl',
    large: 'text-4xl',
  };

  const iconSizes = {
    small: '48px',
    default: '64px',
    large: '80px',
  };

  return (
    <motion.div
      className={`flex items-center gap-4 font-bold ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {showIcon && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative flex-shrink-0"
          style={{
            width: iconSizes[size],
            height: iconSizes[size],
            minWidth: iconSizes[size]
          }}
        >
          <img
            src="/assets/Zeromind.png"
            alt="Zeromind Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </motion.div>
      )}
      <div className={`${textSizes[size]} flex items-center tracking-tight font-['Inter'] relative`}>
        <motion.span
          className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-extrabold"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Zer
        </motion.span>
        <motion.div
          className="relative mx-0.5"
          whileHover={{ scale: 1.15, rotate: 360 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-black">
            0
          </span>
          <div className="absolute inset-0 blur-sm bg-cyan-500/30 animate-pulse" />
        </motion.div>
        <motion.span
          className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent font-extrabold"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Mind
        </motion.span>
      </div>
    </motion.div>
  );
};

export default LogoText; 
 