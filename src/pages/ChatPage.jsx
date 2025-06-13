// src/pages/ChatPage.jsx
import Canvas from '@/components/Canvas';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import ConversationSummary from '@/components/ConversationSummary';
import KeyboardShortcutsDialog from '@/components/KeyboardShortcutsDialog';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import ChatMenu from '@/components/ui/chat-menu';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { fetchAgents, runAgent } from '@/services/api';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, Bot, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Canvas command keywords
───────────────────────────────────────────── */
const CANVAS_COMMANDS = {
  code: ['open a canvas', 'start a coding canvas', 'create code canvas', 'new code editor', '/code'],
  document: ['open document canvas', 'create document', 'new document', 'start writing', '/doc'],
  spreadsheet: ['start spreadsheet', 'open spreadsheet', 'create spreadsheet', 'new spreadsheet', '/sheet'],
  chart: ['open chart canvas', 'create chart', 'new chart', 'start chart', '/chart'],
  whiteboard: ['start whiteboard', 'open whiteboard', 'create whiteboard', 'new whiteboard', '/draw'],
};

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [agents, setAgents] = useState([]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const [canvasType, setCanvasType] = useState('code');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState('');

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const location = useLocation();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    fetchAgents()
      .then((data) => {
        setAgents(data);
        if (data.length > 0) setActiveAgent(data[0]);
      })
      .catch((err) => console.error('Error fetching agents:', err));
  }, []);

  useEffect(() => {
  if (location.state?.initialMessage && activeAgent) {
    handleSendMessage(location.state.initialMessage);
    window.history.replaceState({}, document.title);
  }
}, [location.state, activeAgent]);


  useEffect(() => {
    setShowWelcome(messages.length === 0);
  }, [messages]);

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setMessages([]);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setShowCanvas((p) => !p);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsKeyboardShortcutsOpen(true);
      }
      if (e.key === 'Escape') {
        if (searchFocused) {
          setSearchQuery('');
          searchInputRef.current?.blur();
        } else if (showCanvas) {
          setShowCanvas(false);
        } else if (editingMessageId) {
          setEditingMessageId(null);
          setEditedMessageText('');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchFocused, showCanvas, editingMessageId]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => {
    if (!showWelcome) scrollToBottom();
  }, [messages, showWelcome]);

  useEffect(() => {
    const onScroll = () => {
      if (!chatContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    };
    chatContainerRef.current?.addEventListener('scroll', onScroll);
    return () => chatContainerRef.current?.removeEventListener('scroll', onScroll);
  }, []);

  const inlineCanvas = (text) => {
    const lower = text.toLowerCase().trim();
    for (const [type, list] of Object.entries(CANVAS_COMMANDS)) {
      if (list.some((c) => lower.includes(c))) {
        setCanvasType(type);
        setShowCanvas(true);
        return {
          id: Date.now() + 1,
          text: `Opened a ${type} canvas for you. Use Esc to close.`,
          isUser: false,
          timestamp: new Date(),
        };
      }
    }
    return null;
  };

  const handleSendMessage = async (message, attachments = []) => {
    if (!message.trim() && attachments.length === 0) return;
    if (!activeAgent) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: '❌ Please select an agent to continue.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMsg = { id: Date.now(), text: message, isUser: true, timestamp: new Date(), attachments };
    setMessages((prev) => [...prev, userMsg]);

    const canvasMsg = inlineCanvas(message);
    if (canvasMsg) {
      setMessages((prev) => [...prev, canvasMsg]);
      return;
    }

    setIsTyping(true);
    try {
      const { output } = await runAgent(activeAgent.id, message);
      const aiMsg = {
        id: Date.now() + 1,
        text: output || 'No response from agent.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error running agent:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `❌ Failed to get response: ${err.message || 'Unknown error'}`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEditMessage = (msg) => {
    setEditingMessageId(msg.id);
    setEditedMessageText(msg.text);
  };

  const handleSubmitEditedMessage = () => {
    if (!editedMessageText.trim()) return;
    setMessages((prev) => prev.map((m) => (m.id === editingMessageId ? { ...m, text: editedMessageText } : m)));
    setEditingMessageId(null);
    setEditedMessageText('');
  };

  const handlePromptSelect = (p) => handleSendMessage(p);

  return (
    <div className="flex h-screen bg-background">
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ duration: 0.2 }}>
            <Sidebar onClose={() => setIsSidebarOpen(false)} onOpenKeyboardShortcuts={() => setIsKeyboardShortcutsOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn('flex flex-col flex-1 transition-all duration-200', isSidebarOpen ? 'md:ml-64' : 'ml-0')}>
        {!isSidebarOpen && (
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <KeyboardShortcutsDialog open={isKeyboardShortcutsOpen} onOpenChange={setIsKeyboardShortcutsOpen} />

        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <ChatMenu isLoggedIn={isLoggedIn} onKeyboardShortcuts={() => setIsKeyboardShortcutsOpen(true)} messages={messages} />
        </div>

        <main ref={chatContainerRef} className="flex-1 overflow-y-auto scroll-smooth relative bg-dot-pattern">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background pointer-events-none" />
            <div className="relative min-h-full p-4 md:p-6">
              {showWelcome ? (
                <WelcomeScreen onPromptSelect={handlePromptSelect} />
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  <ConversationSummary messages={messages} selectedRole={activeAgent?.name || ''} />
                  <AnimatePresence>
                    {messages.map((msg, idx) => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                        <ChatBubble message={msg} isUser={msg.isUser} isLast={idx === messages.length - 1} onEdit={msg.isUser ? handleEditMessage : undefined} />
                      </motion.div>
                    ))}
                    {showCanvas && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pl-12">
                        <Canvas onClose={() => setShowCanvas(false)} initialContent={canvasContent} type={canvasType} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 text-muted-foreground pl-12">
                      <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-primary/10">
                        <Bot size={14} className="text-primary animate-pulse" />
                      </div>
                      <div className="flex space-x-2">
                        <span className="animate-bounce">•</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showScrollButton && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-28 right-4 md:right-8">
                <Button size="icon" className="h-10 w-10 rounded-full shadow-lg bg-primary hover:bg-primary/90" onClick={scrollToBottom}>
                  <ArrowDown className="h-5 w-5 text-primary-foreground" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="max-w-4xl mx-auto p-0">
            <ChatInput
              onSendMessage={editingMessageId ? handleSubmitEditedMessage : handleSendMessage}
              placeholder={editingMessageId ? 'Editing message…' : 'Message Zer0Mind…'}
              initialMessage={editingMessageId ? editedMessageText : undefined}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;