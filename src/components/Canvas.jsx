import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { 
  Code2, 
  FileText, 
  Table, 
  BarChart4, 
  PenTool,
  Copy,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

const CANVAS_TYPES = {
  CODE: 'code',
  DOCUMENT: 'document',
  SPREADSHEET: 'spreadsheet',
  CHART: 'chart',
  WHITEBOARD: 'whiteboard'
};

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' }
];

const Canvas = ({ onClose, initialContent = '', type = CANVAS_TYPES.CODE }) => {
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState('javascript');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasType, setCanvasType] = useState(type);
  const [copied, setCopied] = useState(false);

  const handleEditorChange = (value) => {
    setContent(value || '');
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-${Date.now()}.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const getCanvasIcon = () => {
    switch (canvasType) {
      case CANVAS_TYPES.CODE:
        return <Code2 className="h-4 w-4" />;
      case CANVAS_TYPES.DOCUMENT:
        return <FileText className="h-4 w-4" />;
      case CANVAS_TYPES.SPREADSHEET:
        return <Table className="h-4 w-4" />;
      case CANVAS_TYPES.CHART:
        return <BarChart4 className="h-4 w-4" />;
      case CANVAS_TYPES.WHITEBOARD:
        return <PenTool className="h-4 w-4" />;
      default:
        return <Code2 className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group relative rounded-lg border bg-muted/50 overflow-hidden",
        isFullscreen ? "fixed inset-4 z-50 bg-background" : "mb-4"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
        <div className="flex items-center gap-2">
          {getCanvasIcon()}
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-7 w-28 text-xs bg-transparent border-muted">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              <input
                type="file"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className={cn("w-full", isFullscreen ? "h-[calc(100%-40px)]" : "h-[300px]")}>
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            renderWhitespace: 'selection',
            padding: { top: 8, bottom: 8 },
            lineHeight: 1.5,
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          }
        />
      </div>
    </motion.div>
  );
};

export default Canvas; 