import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const ChatLayout = () => {
  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative">
      {/* Global animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-indigo-950/30 to-primary/20 opacity-70"></div>
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 90%), " +
              "radial-gradient(circle at 80% 70%, hsl(var(--secondary) / 0.15) 0%, transparent 90%), " +
              "radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.1) 0%, transparent 90%)",
          }}
        />

        {/* Decorative floating elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={floatingAnimation}
            transition={{
              delay: i * 0.2,
              duration: 3 + i,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <main className="flex-1 flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLayout; 