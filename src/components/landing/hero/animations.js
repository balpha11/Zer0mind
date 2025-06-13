// src/components/landing/hero/animations.js

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const starAnimation = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
  transition: { duration: 20, ease: 'linear', repeat: Infinity },
};
