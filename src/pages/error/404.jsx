import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  const location = useLocation();

  return (
    <div className="flex-1 relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-theme-motif from-motif-start via-motif-mid to-motif-end animate-bg-shift opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full text-center space-y-8 bg-background/80 backdrop-blur-sm p-8 rounded-lg border border-border shadow-lg"
      >
        <div className="space-y-4">
          <motion.h1 
            className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            404
          </motion.h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page <span className="font-mono text-sm">{location.pathname}</span> doesn't exist or has been moved.
          </p>
        </div>

        <div className="grid gap-4">
          <Link to="/">
            <Button variant="default" className="w-full gap-2 group">
              <Home className="w-4 h-4 group-hover:animate-bounce-subtle" />
              Back to Home
            </Button>
          </Link>
          
          <Link to="/agents">
            <Button variant="outline" className="w-full gap-2">
              <Search className="w-4 h-4" />
              Browse Agents
            </Button>
          </Link>

          <button 
            onClick={() => window.history.back()} 
            className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 mt-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Need help? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage; 