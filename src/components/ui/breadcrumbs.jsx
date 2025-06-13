import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  dashboard: 'Dashboard',
  users: 'User Management',
  agents: 'Agent Registry',
  assignments: 'Agent Assignments',
  triage: 'Agent Orchestration',
  tools: 'Tool Manager',
  guardrails: 'Guardrails',
  flows: 'Flow Builder',
  logs: 'Run Logs',
  prompts: 'Prompt Management',
  feedback: 'User Feedback',
  apikeys: 'API Keys',
  settings: 'Settings',
  profile: 'Profile',
};

export function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on the main dashboard
  if (paths.length === 2 && paths[1] === 'dashboard') {
    return null;
  }

  const breadcrumbs = paths.map((path, index) => {
    const routeTo = `/${paths.slice(0, index + 1).join('/')}`;
    const isLast = index === paths.length - 1;
    const name = routeNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

    return (
      <React.Fragment key={path}>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link
          to={routeTo}
          className={`text-sm ${
            isLast
              ? 'font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {name}
        </Link>
      </React.Fragment>
    );
  });

  return (
    <nav className="flex items-center space-x-1">
      <Link
        to="/admin/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs}
    </nav>
  );
} 