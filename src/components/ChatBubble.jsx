import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Check,
  Copy,
  Edit,
  Flag,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react';
import { useState } from 'react';

const ChatBubble = ({ message, isUser, isLast, onEdit }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group flex gap-4 px-4 py-3 rounded-2xl",
        isUser ? "flex-row-reverse bg-primary/5" : "bg-muted/30"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
        isUser ? "bg-primary/10" : "bg-secondary/10"
      )}>
        {isUser ? (
          <span className="text-sm font-medium text-primary">U</span>
        ) : (
          <span className="text-sm font-medium text-secondary">AI</span>
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-2",
        isUser && "text-right"
      )}>
        {/* Message Header */}
        <div className={cn(
          "flex items-center gap-2 text-sm",
          isUser && "flex-row-reverse"
        )}>
          <span className="font-medium">
            {isUser ? "You" : "ZeroMind"}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(message.timestamp, 'h:mm a')}
          </span>
        </div>

        {/* Message Text */}
        <div className={cn(
          "text-sm leading-relaxed",
          isUser && "text-right"
        )}>
          {message.text}
        </div>

        {/* Attachments */}
        {message.attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50"
              >
                <span className="text-xs">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Actions */}
        <div className={cn(
          "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "justify-end flex-row-reverse" : "justify-start"
        )}>
          {isUser ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-lg",
                  isLiked && "text-green-500 bg-green-500/10"
                )}
                onClick={handleLike}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-lg",
                  isDisliked && "text-red-500 bg-red-500/10"
                )}
                onClick={handleDislike}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isUser ? "end" : "start"}>
                  <DropdownMenuItem className="text-destructive">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;