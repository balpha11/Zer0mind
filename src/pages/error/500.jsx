import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RefreshCw, Home, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ServerErrorPage = ({ error }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="flex-1 relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-theme-motif from-motif-start via-motif-mid to-motif-end animate-bg-shift opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-lg w-full text-center space-y-8 bg-background/80 backdrop-blur-sm p-8 rounded-lg border border-border shadow-lg"
      >
        <div className="space-y-4">
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-foreground">500</h1>
          <h2 className="text-2xl font-semibold text-foreground">Server Error</h2>
          <p className="text-muted-foreground">
            Sorry, something went wrong on our end. We're working to fix it.
          </p>
        </div>

        {isDevelopment && error && (
          <div className="bg-muted/50 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-destructive mb-2">Error Details:</p>
            <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
              {error.toString()}
            </pre>
          </div>
        )}

        <div className="grid gap-4">
          <Button 
            variant="default" 
            className="w-full gap-2 group"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4 group-hover:animate-spin" />
            Try Again
          </Button>

          <Link to="/">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <Link to="/contact">
            <Button variant="ghost" className="w-full gap-2">
              <MessageCircle className="w-4 h-4" />
              Report Issue
            </Button>
          </Link>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>Error Code: 500</p>
          <p>If the problem persists, please contact our support team.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerErrorPage; 