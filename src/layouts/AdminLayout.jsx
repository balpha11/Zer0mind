// src/layouts/AdminLayout.jsx
import { Command } from "cmdk";
import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import {
  Bell,
  Bot,
  GitFork,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Search,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  User,
  Users,
  Wrench,
} from "lucide-react";

/* -------------------------------------------------------------
   Helper: decode JWT payload & check expiry
------------------------------------------------------------- */
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > nowInSeconds;
  } catch {
    return false;
  }
};

/* -------------------------------------------------------------
   Sidebar link component
------------------------------------------------------------- */
const AdminSidebarNavLink = ({ to, icon, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-primary/10 text-primary font-medium"
      )}
    >
      {React.cloneElement(icon, { className: "h-5 w-5" })}
      {children}
    </NavLink>
  );
};

/* -------------------------------------------------------------
   Main layout
------------------------------------------------------------- */
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadNotifications] = useState(3);

  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------- auth guard ---------- */
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!isTokenValid(token)) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("isAdminAuthenticated");
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You need to log in as an administrator.",
      });
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, toast]);

  /* ---------- handlers ---------- */
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin/login");
    toast({ title: "Logged Out", description: "Good-bye! 👋" });
  };

  const handleProfileClick = () => navigate("/admin/profile");
  const handleSettingsClick = () => navigate("/admin/settings");

  /* ---------- command-palette options ---------- */
  const searchOptions = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/admin",
    },
    {
      id: "users",
      name: "User Management",
      icon: <Users className="h-4 w-4" />,
      path: "/admin/users",
    },
    {
      id: "agents-registry",
      name: "Agent Registry",
      icon: <Bot className="h-4 w-4" />,
      path: "/admin/agents",
    },
    {
      id: "agents-assignment",
      name: "Agent Assignment",
      icon: <Shield className="h-4 w-4" />,
      path: "/admin/agents/assignment",
    },
    {
      id: "agents-orchestration",
      name: "Agent Orchestration",
      icon: <GitFork className="h-4 w-4" />,
      path: "/admin/agents/orchestration",
    },
    {
      id: "api-keys",
      name: "API Keys",
      icon: <KeyRound className="h-4 w-4" />,
      path: "/admin/api-keys",
    },
    {
      id: "tools",
      name: "Tool Manager",
      icon: <Wrench className="h-4 w-4" />,
      path: "/admin/tools",
    },
  ];

  /* ---------- sidebar markup ---------- */
  const SidebarContent = () => (
    <div className="flex h-full max-h-screen flex-col">
      {/* logo / header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/admin" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg">Admin&nbsp;Panel</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {/* --- Overview --- */}
          <div className="px-2 py-4">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
              Overview
            </h2>
            <div className="space-y-1">
              <AdminSidebarNavLink to="/admin" icon={<LayoutDashboard />}>
                Dashboard
              </AdminSidebarNavLink>
              <AdminSidebarNavLink to="/admin/users" icon={<Users />}>
                User Management
              </AdminSidebarNavLink>
            </div>
          </div>

          {/* --- AI System --- */}
          <div className="px-2 py-4">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
              AI&nbsp;System
            </h2>
            <div className="space-y-1">
              <AdminSidebarNavLink to="/admin/agents" icon={<Bot />}>
                Agent Registry
              </AdminSidebarNavLink>
              <AdminSidebarNavLink
                to="/admin/agents/assignment"
                icon={<Shield />}
              >
                Agent Assignment
              </AdminSidebarNavLink>
              <AdminSidebarNavLink
                to="/admin/agents/orchestration"
                icon={<GitFork />}
              >
                Agent Orchestration
              </AdminSidebarNavLink>
              <AdminSidebarNavLink to="/admin/tools" icon={<Wrench />}>
                Tool Manager
              </AdminSidebarNavLink>
              <AdminSidebarNavLink to="/admin/guardrails" icon={<ShieldCheck />}>
                Guardrails
              </AdminSidebarNavLink>
              <AdminSidebarNavLink to="/admin/flows" icon={<Share2 />}>
                Flow Builder
              </AdminSidebarNavLink>
            </div>
          </div>

          {/* --- Monitoring --- */}
          <div className="px-2 py-4">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
              Monitoring
            </h2>
            <div className="space-y-1">
              <AdminSidebarNavLink to="/admin/logs" icon={<History />}>
                Run Logs
              </AdminSidebarNavLink>
              <AdminSidebarNavLink to="/admin/prompts" icon={<MessageSquare />}>
                Prompt Management
              </AdminSidebarNavLink>
              <AdminSidebarNavLink to="/admin/feedback" icon={<MessageCircle />}>
                User Feedback
              </AdminSidebarNavLink>
            </div>
          </div>

          {/* --- Administration --- */}
          <div className="px-2 py-4">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
              Administration
            </h2>
            <div className="space-y-1">
              <AdminSidebarNavLink to="/admin/api-keys" icon={<KeyRound />}>
                API Keys
              </AdminSidebarNavLink>
              <AdminSidebarNavLink to="/admin/settings" icon={<Settings />}>
                Settings
              </AdminSidebarNavLink>
            </div>
          </div>
        </nav>
      </div>

      {/* footer / profile */}
      <div className="mt-auto border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-5 w-5" />
              <span>Admin Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My&nbsp;Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log&nbsp;out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  /* -----------------------------------------------------------
     render
  ----------------------------------------------------------- */
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* sidebar */}
      <aside
        className={cn(
          "w-64 border-r bg-card transition-all duration-300",
          !isSidebarOpen && "w-0"
        )}
      >
        <SidebarContent />
      </aside>

      {/* main */}
      <main className="flex-1 overflow-auto">
        {/* top bar */}
        <div className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Breadcrumbs />

          {/* grow / spacer */}
          <div className="flex-1" />

          {/* search trigger */}
          <Button
            variant="outline"
            className="hidden items-center gap-2 lg:inline-flex"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span>Search…</span>
            <kbd className="ml-2 hidden rounded border bg-muted px-1.5 font-mono text-xs font-medium sm:inline-block">
              ⌘K
            </kbd>
          </Button>

          {/* notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadNotifications}
              </span>
            )}
          </Button>

          {/* profile dropdown (duplicated for top-bar quick access) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My&nbsp;Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Log&nbsp;out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* routed pages */}
        <div className="container p-6">
          <Outlet />
        </div>
      </main>

      {/* command palette */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[560px] p-0">
          <Command className="rounded-lg border shadow-md">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 opacity-50" />
              <input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none"
                placeholder="Type a command or search…"
                cmdk-input=""
              />
              <kbd className="ml-auto hidden rounded bg-muted px-1.5 font-mono text-xs sm:inline-block">
                ESC
              </kbd>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                {searchOptions.map((opt) => (
                  <Command.Item
                    key={opt.id}
                    onSelect={() => {
                      navigate(opt.path);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    {opt.icon}
                    {opt.name}
                  </Command.Item>
                ))}
              </Command.List>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLayout;
