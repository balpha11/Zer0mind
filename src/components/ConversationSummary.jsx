import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Hash } from 'lucide-react';

const ConversationSummary = ({ messages, selectedRole }) => {
  const messageCount = messages.length;
  const userMessages = messages.filter(m => m.isUser).length;
  const aiMessages = messages.filter(m => !m.isUser).length;
  const startTime = messages[0]?.timestamp || new Date();
  const duration = Math.round((new Date() - new Date(startTime)) / 1000 / 60); // in minutes

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 border rounded-lg p-4 mb-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Conversation Summary</h3>
        <span className="text-xs text-muted-foreground">{selectedRole}</span>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-2xs text-muted-foreground">Messages</p>
            <p className="text-sm font-medium">
              {messageCount} ({userMessages} you, {aiMessages} AI)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-2xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">
              {duration < 60 
                ? `${duration}m` 
                : `${Math.floor(duration/60)}h ${duration%60}m`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Hash className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-2xs text-muted-foreground">Topics</p>
            <p className="text-sm font-medium">
              {selectedRole}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationSummary; 