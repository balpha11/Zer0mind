import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import useSettingsStore from '@/store/settingsStore';
import { motion } from 'framer-motion';
import {
  Bell,
  Bot,
  Globe,
  Laptop,
  MessageSquare,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';

const SettingsPage = ({ isDialog = false }) => {
  const { toast } = useToast();
  const settings = useSettingsStore();
  
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

  return (
    <div className={cn(
      "space-y-8",
      isDialog ? "py-4" : "container max-w-4xl py-6"
    )}>
      {!isDialog && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and customize your Zer0Mind AI experience.
          </p>
        </motion.div>
      )}

      <Separator />

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how Zer0Mind looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      {/* Chat Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat Preferences
          </CardTitle>
          <CardDescription>
            Customize your chat experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      {/* AI Assistant Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <CardDescription>
            Customize Zer0Mind's behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language
          </CardTitle>
          <CardDescription>
            Choose your preferred language
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleReset}
          className="min-w-[200px]"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
        <Button 
          size="lg" 
          onClick={handleSave}
          className="min-w-[200px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage; 