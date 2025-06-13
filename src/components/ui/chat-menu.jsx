// src/components/ui/ChatMenu.jsx
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import {
  BookmarkPlus,
  Check,
  Command,
  Download,
  LogIn,
  LogOut,
  MoreVertical,
  Settings2,
  Share2,
  User,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsDialog from "../SettingsDialog";


const ChatMenu = ({ onKeyboardShortcuts, isLoggedIn = false, messages = [] }) => {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleShareChat = async () => {
    try {
      const formattedConversation = messages
        .map(msg => {
          const sender = msg.isUser ? 'You' : 'ZeroMind';
          const timestamp = format(msg.timestamp, 'MMM d, yyyy h:mm a');
          return `${sender} [${timestamp}]: ${msg.text}`;
        })
        .join('\n\n');

      if (!formattedConversation) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      await navigator.clipboard.writeText(formattedConversation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to share chat:', err);
    }
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="default" size="sm" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onKeyboardShortcuts}>
              <Command className="h-4 w-4 mr-2" />
              Keyboard Shortcuts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border">
            <User className="h-5 w-5 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="font-medium text-foreground">Welcome</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email || 'User'}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onKeyboardShortcuts}>
            <Command className="h-4 w-4 mr-2" />
            Keyboard Shortcuts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareChat}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share Chat
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save for Later
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Export Chat
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSettings}>
            <Settings2 className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-red-500">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ChatMenu;