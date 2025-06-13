// src/components/ChatInput.jsx
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Image,
  Mic,
  Paperclip,
  Plus,
  SendHorizonal,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ChatInput = ({
  onSendMessage,
  placeholder = 'Message Zer0Mind…',
  isStatic = false,
  initialMessage,
}) => {
  /* ───────────── State ───────────── */
  const [message, setMessage] = useState(initialMessage || '');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState([]);

  /* ───────────── Refs ───────────── */
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  /* ───────────── Recording timer ───────────── */
  const [recordingTime, setRecordingTime] = useState(0);
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1_000,
      );
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  /* ───────────── Populate textarea when editing ───────────── */
  useEffect(() => {
    setMessage(initialMessage || '');
    if (inputRef.current && initialMessage) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120,
      )}px`;
    }
  }, [initialMessage]);

  /* ───────────── Helpers ───────────── */
  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAttachments((a) => [
          ...a,
          {
            id: crypto.randomUUID(),
            name: `Voice Message (${formatTime(recordingTime)})`,
            type: 'audio/wav',
            url,
          },
        ]);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120,
      )}px`;
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        data: file,
      })),
    ]);
  };

  const removeAttachment = (id) =>
    setAttachments((a) => a.filter((f) => f.id !== id));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /* ───────────── Static (read-only) mode ───────────── */
  if (isStatic)
    return (
      <div className="flex w-full max-w-2xl items-center space-x-2 p-3 bg-card rounded-xl shadow-lg border border-border">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-foreground placeholder-muted-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled
        />
        <Button size="icon" className="bg-primary rounded-lg" disabled>
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    );

  /* ───────────── Main (interactive) mode ───────────── */
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Attachments preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2 px-2"
          >
            {attachments.map((file) => (
              <motion.div
                key={file.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative group"
              >
                <div className="flex items-center space-x-2 bg-card rounded-lg px-3 py-1.5 pr-8 border text-sm">
                  {file.type.startsWith('image/') ? (
                    <Image size={16} className="text-primary" />
                  ) : file.type.startsWith('audio/') ? (
                    <Mic size={16} className="text-primary" />
                  ) : (
                    <Paperclip size={16} className="text-primary" />
                  )}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(file.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input box */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col w-full bg-card rounded-2xl shadow-lg overflow-hidden"
        layout
      >
        {/* Textarea */}
        <div className="w-full px-4 pt-3">
          <textarea
            ref={inputRef}
            value={isRecording ? '' : message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Recording…' : placeholder}
            className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none resize-none leading-tight text-[15px] min-h-[24px]"
            rows={1}
            style={{ maxHeight: '120px' }}
            disabled={isRecording}
          />
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between p-2 px-4">
          {/* Left actions */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg bg-black/5 hover:bg-black/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add photos and files</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'text-muted-foreground hover:text-primary h-7 w-7',
                isRecording && 'text-destructive',
              )}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              size="icon"
              className={cn(
                'bg-primary hover:bg-primary/90 rounded-lg h-7 w-7',
                !message.trim() && attachments.length === 0 && 'opacity-50',
              )}
              disabled={!message.trim() && attachments.length === 0}
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Footer note */}
      <div className="text-center mt-2 space-y-1">
        <p className="text-xs text-muted">
          I can make mistakes. Consider verifying important information.
        </p>
        <p className="text-xs text-muted">Zer0Mind AI v1.0.2</p>
      </div>
    </div>
  );
};

export default ChatInput;
