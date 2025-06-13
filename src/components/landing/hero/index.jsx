// src/components/landing/hero/index.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroButtons from './HeroButtons';
import {
  containerVariants,
  itemVariants
} from './animations';
import {
  HERO_TITLE,
  BRAND_NAME,
  HERO_DESCRIPTION
} from './constants';
import { styles } from './styles';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const EXAMPLE_QUERIES = [
  {
    category: "Strategy",
    examples: [
      "How to find product-market fit?",
      "Create a go-to-market strategy",
      "Scale my startup efficiently"
    ]
  },
  {
    category: "Marketing",
    examples: [
      "Generate more qualified leads",
      "Improve conversion rates",
      "Create content marketing plan"
    ]
  },
  {
    category: "Growth",
    examples: [
      "Increase customer retention",
      "Optimize user acquisition",
      "Reduce customer churn"
    ]
  }
];

const ExampleCard = ({ category, examples, onExampleClick }) => (
  <motion.div
    variants={itemVariants}
    className="bg-background/40 backdrop-blur-sm border border-primary/10 rounded-xl p-4 hover:border-primary/20 transition-all duration-300"
  >
    <h3 className="text-sm font-medium text-primary mb-3 flex items-center">
      <Sparkles className="h-4 w-4 mr-2" />
      {category}
    </h3>
    <div className="space-y-2">
      {examples.map((example, index) => (
        <button
          key={index}
          onClick={() => onExampleClick(example)}
          className="w-full text-left text-sm text-muted-foreground hover:text-foreground py-1 px-2 rounded-lg hover:bg-primary/5 transition-colors duration-200"
        >
          {example}
        </button>
      ))}
    </div>
  </motion.div>
);

const HeroSection = () => {
  const [message, setMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Auto-focus the input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 1000); // Delay focus to allow for initial animations
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      navigate('/chat', { state: { initialMessage: message } });
    }
  };

  const handleExampleClick = (example) => {
    setMessage(example);
    inputRef.current?.focus();
  };

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1 
          className={cn(styles.title, "max-w-4xl mx-auto")} 
          variants={itemVariants}
        >
          {HERO_TITLE}{' '}
          <span className={styles.brandText}>
            {BRAND_NAME}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className={cn(styles.description, "max-w-2xl mx-auto")} 
          variants={itemVariants}
        >
          {HERO_DESCRIPTION}
        </motion.p>

        {/* Chat Input */}
        <motion.form 
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mx-auto mb-8 px-4 relative"
          variants={itemVariants}
        >
          {/* Pulsing highlight effect */}
          <motion.div
            className="absolute -inset-3 rounded-2xl bg-primary/10 backdrop-blur-sm -z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              scale: [0.98, 1, 0.98],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="relative flex items-center">
            <div className="absolute left-4 text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask anything about growing your business..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className={cn(
                "pl-12 pr-28 py-6 h-16 text-lg bg-background/80 backdrop-blur border-primary/20 focus:border-primary/40 rounded-xl shadow-lg transition-all duration-300",
                isInputFocused && "ring-2 ring-primary/20 border-primary/40 bg-background/90",
                !message && "animate-bounce-subtle"
              )}
            />
            <Button
              type="submit"
              size="lg"
              className={cn(
                "absolute right-2 bg-primary hover:bg-primary/90 transition-all duration-300 rounded-lg h-12 px-6",
                isInputFocused && "bg-primary/90 shadow-lg"
              )}
              disabled={!message.trim()}
            >
              <span className="mr-2">Ask AI</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.form>

        {/* Example Queries */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-3xl mx-auto px-4 mb-12"
        >
          <p className="text-sm text-muted-foreground/80 mb-4 text-center">
            Try these example questions or ask your own
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXAMPLE_QUERIES.map((category, index) => (
              <ExampleCard
                key={index}
                category={category.category}
                examples={category.examples}
                onExampleClick={handleExampleClick}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants}>
          <HeroButtons />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
