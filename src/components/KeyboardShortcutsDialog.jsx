// src/components/KeyboardShortcutsDialog.jsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Command, Keyboard } from 'lucide-react';
import React from 'react';

const SHORTCUTS = [
  { keys: ['⌘/Ctrl', 'K'], description: 'Search messages' },
  { keys: ['⌘/Ctrl', 'B'], description: 'Toggle canvas' },
  { keys: ['⌘/Ctrl', 'N'], description: 'New chat' },
  { keys: ['⌘/Ctrl', 'Z'], description: 'Undo last message' },
  { keys: ['⌘/Ctrl', '↵'], description: 'Send message' },
  { keys: ['⇧ Shift', '↵'], description: 'New line' },
  { keys: ['Esc'], description: 'Close canvas/Clear search' },
  { keys: ['⌘/Ctrl', '/'], description: 'Show shortcuts' },
];

const KeyboardShortcutsDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-primary/10"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 py-4">
          {SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <kbd className="px-2 py-1 text-xs font-mono rounded-md bg-muted">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;