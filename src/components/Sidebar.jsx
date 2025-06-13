import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import {
  Archive,
  Bot,
  Brain,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Filter,
  LineChart,
  MessageSquare,
  Pin,
  PlusCircle,
  Search,
  Settings,
  Star,
  Tags,
  Target,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SettingsDialog from './SettingsDialog';

const categories = [
  {
    id: 'strategy',
    icon: Target,
    label: 'Strategy & Planning',
    color: 'text-blue-400'
  },
  {
    id: 'marketing',
    icon: LineChart,
    label: 'Marketing & Growth',
    color: 'text-green-400'
  },
  {
    id: 'product',
    icon: Code,
    label: 'Product Development',
    color: 'text-purple-400'
  },
  {
    id: 'sales',
    icon: Briefcase,
    label: 'Sales & Revenue',
    color: 'text-orange-400'
  },
  {
    id: 'operations',
    icon: Users,
    label: 'Team & Operations',
    color: 'text-pink-400'
  },
  {
    id: 'innovation',
    icon: Brain,
    label: 'Innovation & Tech',
    color: 'text-indigo-400'
  }
];

const folders = [
  {
    id: 'work',
    name: 'Work Projects',
    icon: Briefcase,
    color: 'text-blue-400'
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: Users,
    color: 'text-green-400'
  },
  {
    id: 'archive',
    name: 'Archive',
    icon: Archive,
    color: 'text-orange-400'
  }
];

const SidebarNavLink = ({ to, icon: Icon, children, color = "text-muted-foreground", badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-accent/10 group relative",
        isActive ? "bg-accent/20 text-accent-foreground font-medium" : color
      )
    }
  >
    <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
    <span className="truncate flex-1">{children}</span>
    {badge !== undefined && (
      <span className="text-muted-foreground text-xs bg-muted/30 px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </NavLink>
);

const Sidebar = ({ onClose, onOpenKeyboardShortcuts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(['work']);
  const [pinnedChats, setPinnedChats] = useState([
    { id: 1, title: "Important Meeting Notes", category: "strategy" },
    { id: 2, title: "Project Roadmap", category: "product" }
  ]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const recentChats = [
    { id: 1, title: "Business Plan Review", category: "strategy", folder: "work" },
    { id: 2, title: "Marketing Campaign Analysis", category: "marketing", folder: "work" },
    { id: 3, title: "Product Feature Prioritization", category: "product", folder: "personal" },
    { id: 4, title: "Sales Pipeline Optimization", category: "sales", folder: "work" }
  ];

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const filteredChats = recentChats.filter(chat => 
    (!selectedCategory || chat.category === selectedCategory) &&
    (!searchQuery || chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={cn(
      "w-72 fixed top-0 bottom-0 left-0 z-40 bg-background/95 backdrop-blur-sm border-r border-border/50 transition-transform duration-200",
      "md:block md:translate-x-0",
      onClose ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <Bot className="h-7 w-7 text-primary" />
            <span className="font-semibold text-xl">Zer0Mind</span>
          </Link>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-accent/10 md:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* New Chat Button */}
          <Link to="/chat">
            <Button 
              size="lg" 
              className="w-full bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> New Chat
            </Button>
          </Link>

          {/* Search Chats */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-muted/30 border-0 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-ring transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-between bg-muted/30 border-border/50 text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'All Categories'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => setSelectedCategory(null)} className="hover:bg-accent/10">
                  <Tags className="mr-2 h-4 w-4" />
                  <span>All Categories</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map(category => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="hover:bg-accent/10"
                  >
                    <category.icon className={cn("mr-2 h-4 w-4", category.color)} />
                    <span>{category.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Pinned Chats */}
          {pinnedChats.length > 0 && (
            <div>
              <div className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-2">
                Pinned
              </div>
              <div className="space-y-1">
                {pinnedChats.map(chat => {
                  const category = categories.find(c => c.id === chat.category);
                  return (
                    <Link
                      key={chat.id}
                      to={`/chat/${chat.id}`}
                      className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground text-sm rounded-lg transition-all duration-200 hover:bg-accent/10"
                    >
                      <Pin className="h-4 w-4 text-primary/70" />
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Access */}
          <div>
            <div className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-2">
              Quick Access
            </div>
            <div className="space-y-1">
              <SidebarNavLink to="/chat" icon={MessageSquare} badge={filteredChats.length}>
                All Conversations
              </SidebarNavLink>
              <SidebarNavLink to="/starred" icon={Star}>
                Starred
              </SidebarNavLink>
              <SidebarNavLink to="/recent" icon={Clock}>
                Recent
              </SidebarNavLink>
            </div>
          </div>

          {/* Folders */}
          <div>
            <div className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-2">
              Folders
            </div>
            <div className="space-y-1">
              {folders.map(folder => (
                <div key={folder.id}>
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground text-sm rounded-lg transition-all duration-200 hover:bg-accent/10",
                      expandedFolders.includes(folder.id) && "text-foreground bg-accent/5"
                    )}
                  >
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedFolders.includes(folder.id) && "transform rotate-90"
                      )} 
                    />
                    <folder.icon className={cn("h-4 w-4", folder.color)} />
                    <span className="truncate flex-1">{folder.name}</span>
                    <span className="text-xs text-muted-foreground/70 bg-muted/30 px-2 py-0.5 rounded-full">
                      {filteredChats.filter(chat => chat.folder === folder.id).length}
                    </span>
                  </button>
                  {expandedFolders.includes(folder.id) && (
                    <div className="ml-9 mt-1 space-y-1">
                      {filteredChats
                        .filter(chat => chat.folder === folder.id)
                        .map(chat => {
                          const category = categories.find(c => c.id === chat.category);
                          return (
                            <Link
                              key={chat.id}
                              to={`/chat/${chat.id}`}
                              className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground text-sm rounded-lg transition-all duration-200 hover:bg-accent/10"
                            >
                              <category.icon className={cn("h-4 w-4", category.color)} />
                              <span className="truncate">{chat.title}</span>
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-2">
              Categories
            </div>
            <div className="space-y-1">
              {categories.map(category => (
                <SidebarNavLink 
                  key={category.id}
                  to={`/chat/category/${category.id}`}
                  icon={category.icon}
                  color={category.color}
                  badge={filteredChats.filter(chat => chat.category === category.id).length}
                >
                  {category.label}
                </SidebarNavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        onOpenKeyboardShortcuts={onOpenKeyboardShortcuts}
      />
    </div>
  );
};

export default Sidebar;