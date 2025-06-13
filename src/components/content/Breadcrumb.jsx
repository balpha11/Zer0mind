import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbMap = {
    content: "Resources",
    "knowledge-base": "Knowledge Base",
    "agent-docs": "Agent Documentation",
    training: "Training Material",
    forum: "Community Forum",
    faq: "FAQ",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-primary flex items-center">
        <Home className="h-4 w-4" />
      </Link>
      {pathSegments.map((segment, index) => (
        <div key={segment} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2" />
          {index === pathSegments.length - 1 ? (
            <span className="text-primary font-medium">
              {breadcrumbMap[segment] || segment}
            </span>
          ) : (
            <Link
              to={`/${pathSegments.slice(0, index + 1).join("/")}`}
              className="hover:text-primary"
            >
              {breadcrumbMap[segment] || segment}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb; 