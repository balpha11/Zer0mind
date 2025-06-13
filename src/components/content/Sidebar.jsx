import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  GraduationCap,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

const navItems = [
  {
    title: "Knowledge Base",
    href: "/content/knowledge-base",
    icon: BookOpen,
  },
  {
    title: "Agent Docs",
    href: "/content/agent-docs",
    icon: FileText,
  },
  {
    title: "Training Material",
    href: "/content/training",
    icon: GraduationCap,
  },
  {
    title: "Community Forum",
    href: "/content/forum",
    icon: MessageSquare,
  },
  {
    title: "FAQ",
    href: "/content/faq",
    icon: HelpCircle,
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Content Management</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100",
                  location.pathname === item.href ? "bg-gray-100" : ""
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 