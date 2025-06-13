import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { cn } from "@/lib/utils";
import useSettingsStore from '@/store/settingsStore';
import {
  Bell,
  Bot,
  Globe,
  Keyboard,
  Laptop,
  MessageSquare,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useState } from 'react';

const SettingsDialog = ({ open, onOpenChange, onOpenKeyboardShortcuts }) => {
  const { toast } = useToast();
  const settings = useSettingsStore();
  const [activeSection, setActiveSection] = useState('appearance');

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'chat', label: 'Chat Preferences', icon: MessageSquare },
    { id: 'keyboard', label: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleReset = () => {
    settings.resetSettings();
    toast({
      title: "Settings reset",
      description: "All settings have been restored to their default values.",
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <Label>Theme</Label>
            <RadioGroup
              value={settings.theme}
              onValueChange={settings.setTheme}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-1.5">
                  <Sun className="h-4 w-4" />
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-1.5">
                  <Moon className="h-4 w-4" />
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center gap-1.5">
                  <Laptop className="h-4 w-4" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 'keyboard':
        return (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenKeyboardShortcuts();
                onOpenChange(false); // Close SettingsDialog
              }}
              className="w-full"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              View Keyboard Shortcuts
            </Button>
            <Separator />
            {[
              { action: 'Search messages', shortcut: { ctrl: true, key: 'K' } },
              { action: 'Toggle canvas', shortcut: { ctrl: true, key: 'B' } },
              { action: 'New chat', shortcut: { ctrl: true, key: 'N' } },
              { action: 'Undo last message', shortcut: { ctrl: true, key: 'Z' } },
              { action: 'Send message', shortcut: { ctrl: true, key: '↵' } },
              { action: 'New line', shortcut: { shift: true, key: '↵' } },
              { action: 'Close canvas/Clear search', shortcut: { key: 'Esc' } },
              { action: 'Show shortcuts', shortcut: { ctrl: true, key: '/' } },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 text-muted-foreground"
              >
                <span className="text-sm">{item.action}</span>
                <div className="flex items-center gap-1">
                  {item.shortcut.ctrl && (
                    <>
                      <kbd className="px-2 py-1 text-xs bg-accent rounded">⌘/Ctrl</kbd>
                      <span className="text-xs">+</span>
                    </>
                  )}
                  {item.shortcut.shift && (
                    <>
                      <kbd className="px-2 py-1 text-xs bg-accent rounded">⇧ Shift</kbd>
                      <span className="text-xs">+</span>
                    </>
                  )}
                  <kbd className="px-2 py-1 text-xs bg-accent rounded">
                    {item.shortcut.key}
                  </kbd>
                </div>
              </div>
            ))}
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates and summaries via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={settings.setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications on your desktop
                </p>
              </div>
              <Switch
                checked={settings.desktopNotifications}
                onCheckedChange={settings.setDesktopNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for notifications
                </p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={settings.setSoundEnabled}
                icon={settings.soundEnabled ? <Volume2 /> : <VolumeX />}
              />
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enter to Send</Label>
                <p className="text-sm text-muted-foreground">
                  Use Enter key to send messages
                </p>
              </div>
              <Switch
                checked={settings.enterToSend}
                onCheckedChange={settings.setEnterToSend}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-scroll</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically scroll to new messages
                </p>
              </div>
              <Switch
                checked={settings.autoScroll}
                onCheckedChange={settings.setAutoScroll}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Timestamps</Label>
                <p className="text-sm text-muted-foreground">
                  Display message timestamps
                </p>
              </div>
              <Switch
                checked={settings.showTimestamps}
                onCheckedChange={settings.setShowTimestamps}
              />
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Response Length</Label>
              <Slider
                value={[settings.responseLength]}
                onValueChange={([value]) => settings.setResponseLength(value)}
                max={3}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Concise</span>
                <span>Balanced</span>
                <span>Detailed</span>
              </div>
            </div>
            <div className="space-y-4">
              <Label>AI Personality</Label>
              <RadioGroup
                value={settings.aiPersonality}
                onValueChange={settings.setAiPersonality}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friendly" id="friendly" />
                  <Label htmlFor="friendly">Friendly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="technical" id="technical" />
                  <Label htmlFor="technical">Technical</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-suggestions</Label>
                <p className="text-sm text-muted-foreground">
                  Show relevant suggestions while typing
                </p>
              </div>
              <Switch
                checked={settings.autoSuggestions}
                onCheckedChange={settings.setAutoSuggestions}
              />
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-6">
            <RadioGroup
              value={settings.language}
              onValueChange={settings.setLanguage}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="english" />
                <Label htmlFor="english">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spanish" id="spanish" />
                <Label htmlFor="spanish">Español</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="french" id="french" />
                <Label htmlFor="french">Français</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="german" id="german" />
                <Label htmlFor="german">Deutsch</Label>
              </div>
            </RadioGroup>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-background">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 gap-8 overflow-hidden">
          {/* Left sidebar */}
          <div className="w-[200px] space-y-1 pr-6 border-r border-border/10">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap",
                  activeSection === section.id 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <section.icon className="h-4 w-4 shrink-0 mr-2" />
                <span className="truncate">{section.label}</span>
              </button>
            ))}
          </div>
          
          {/* Right content area */}
          <div className="flex-1 overflow-y-auto py-2 min-h-[400px]">
            {renderContent()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 mt-6 border-t border-border/10">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="min-w-[120px]"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            className="min-w-[120px]"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;