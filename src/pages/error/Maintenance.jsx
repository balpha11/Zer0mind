import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Timer, Bell, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MaintenancePage = () => {
  // You can make this dynamic by fetching from your backend
  const estimatedDowntime = "2 hours";
  const statusPageUrl = "https://status.yourdomain.com";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Timer className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Scheduled Maintenance</h1>
          <p className="text-muted-foreground">
            We're currently performing scheduled maintenance to improve our services.
            We'll be back in approximately {estimatedDowntime}.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">What's happening?</h3>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li>• System upgrades to improve performance</li>
              <li>• Security enhancements</li>
              <li>• Database optimization</li>
            </ul>
          </div>

          <div className="grid gap-4">
            <a href={statusPageUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                Check Status Page
              </Button>
            </a>

            <Button variant="ghost" className="w-full gap-2">
              <Bell className="w-4 h-4" />
              Get Notified When We're Back
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Thank you for your patience!</p>
          <p className="mt-2">
            Questions? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage; 