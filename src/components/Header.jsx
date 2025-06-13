import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";
import { 
  LogIn, 
  LogOut, 
  Menu, 
  Moon, 
  Sun, 
  X, 
  ChevronDown,
  BookOpen,
  FileText,
  GraduationCap,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LogoText from "@/components/ui/logo-text";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const resourcesItems = [
    {
      title: "Knowledge Base",
      href: "/content/knowledge-base",
      icon: BookOpen,
      description: "Browse our comprehensive documentation"
    },
    {
      title: "Agent Documentation",
      href: "/content/agent-docs",
      icon: FileText,
      description: "Detailed guides for all agents"
    },
    {
      title: "Training Material",
      href: "/content/training",
      icon: GraduationCap,
      description: "Learn how to use the platform"
    },
    {
      title: "Community Forum",
      href: "/content/forum",
      icon: MessageSquare,
      description: "Join discussions with other users"
    },
    {
      title: "FAQ",
      href: "/content/faq",
      icon: HelpCircle,
      description: "Find answers to common questions"
    }
  ];

  return (
    <header className="sticky top-4 z-50 flex justify-center w-full px-4">
      <div className={cn(
        "relative flex items-center w-full max-w-screen-2xl border-border/40 rounded-[16px] h-16 backdrop-blur transition-all duration-200",
        isScrolled 
          ? "bg-background/95 supports-[backdrop-filter]:bg-background/60 border shadow-[0_2px_20px_-3px_hsl(var(--primary)_/_0.2)] border-primary/20" 
          : "bg-transparent border-transparent"
      )}>
        {/* Logo on the left */}
        <Link to="/" className="ml-4 sm:ml-6 flex items-center">
          <LogoText size="default" className="hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Nav links centered - Desktop */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-8">
          <NavLink
            to="/features"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary font-semibold" : "text-foreground/70"
              )
            }
          >
            Features
          </NavLink>
          <NavLink
            to="/agents"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary font-semibold" : "text-foreground/70"
              )
            }
          >
            Agents
          </NavLink>
          <div className="relative">
            <button
              className="flex items-center text-sm font-medium text-foreground/70 hover:text-primary"
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            >
              Resources
              <ChevronDown className={cn(
                "ml-1 h-4 w-4 transition-transform duration-200",
                isResourcesOpen && "transform rotate-180"
              )} />
            </button>
            
            {/* Resources Dropdown */}
            {isResourcesOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-background border border-border/40 rounded-lg shadow-lg p-2">
                {resourcesItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-start p-2 hover:bg-primary/5 rounded-md group"
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3 text-primary/60 group-hover:text-primary" />
                    <div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-foreground/60">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary font-semibold" : "text-foreground/70"
              )
            }
          >
            Pricing
          </NavLink>
        </nav>

        {/* Auth buttons and theme toggle - Desktop */}
        <div className="hidden md:flex items-center gap-3 ml-auto mr-4 sm:mr-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="px-2 hover:text-primary"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            asChild
          >
            <Link to={user ? "/chat" : "/login"}>
              {user ? "Dashboard" : "Login"}
              <LogIn className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border border-border/40 rounded-lg shadow-lg">
            <nav className="flex flex-col space-y-4">
              <NavLink
                to="/features"
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary py-2",
                    isActive ? "text-primary font-semibold" : "text-foreground/70"
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </NavLink>
              <NavLink
                to="/agents"
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary py-2",
                    isActive ? "text-primary font-semibold" : "text-foreground/70"
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agents
              </NavLink>
              
              {/* Resources Section in Mobile Menu */}
              <div className="py-2 border-t border-border/40">
                <div className="text-sm font-semibold text-foreground/70 mb-2">Resources</div>
                {resourcesItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center py-2 text-sm text-foreground/70 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Link>
                ))}
              </div>

              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary py-2",
                    isActive ? "text-primary font-semibold" : "text-foreground/70"
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </NavLink>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-center hover:text-primary"
                >
                  {theme === 'light' ? (
                    <span className="flex items-center">
                      <Moon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sun className="h-5 w-5 mr-2" />
                      Light Mode
                    </span>
                  )}
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full justify-center bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to={user ? "/chat" : "/login"}>
                    <span className="flex items-center">
                      {user ? "Dashboard" : "Login"}
                      <LogIn className="ml-2 h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
