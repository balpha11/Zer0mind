import Breadcrumb from "@/components/content/Breadcrumb";
import { BookOpen, Clock, Search, Star, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    articles: [
      {
        id: 1,
        title: "What is Zer0Mind?",
        slug: "what-is-zer0mind",
        readTime: "4 min",
        popularity: 92,
        lastUpdated: "2024-06-01",
      },
      {
        id: 2,
        title: "How to Use Built-in Business Agents",
        slug: "using-business-agents",
        readTime: "6 min",
        popularity: 89,
        lastUpdated: "2024-05-25",
      },
      {
        id: 3,
        title: "Top 5 Use-Cases for Startups",
        slug: "top-use-cases",
        readTime: "7 min",
        popularity: 87,
        lastUpdated: "2024-05-20",
      },
    ],
  },
  {
    title: "Automation Features",
    icon: Zap,
    articles: [
      {
        id: 4,
        title: "Automating Market Research",
        slug: "automate-market-research",
        readTime: "5 min",
        popularity: 91,
        lastUpdated: "2024-06-10",
      },
      {
        id: 5,
        title: "Generating Business Reports with AI",
        slug: "ai-business-reports",
        readTime: "8 min",
        popularity: 88,
        lastUpdated: "2024-06-08",
      },
      {
        id: 6,
        title: "Using Zer0Mind for Brand Creation",
        slug: "brand-creation-guide",
        readTime: "5 min",
        popularity: 85,
        lastUpdated: "2024-06-05",
      },
    ],
  },
  {
    title: "Strategy & Scaling",
    articles: [
      {
        id: 7,
        title: "Creating a Business Model with AI Assistance",
        slug: "ai-business-model",
        readTime: "7 min",
        popularity: 90,
        lastUpdated: "2024-05-18",
      },
      {
        id: 8,
        title: "How Zer0Mind Supports Early-Stage Funding",
        slug: "funding-support",
        readTime: "6 min",
        popularity: 83,
        lastUpdated: "2024-05-10",
      },
      {
        id: 9,
        title: "From Idea to Launch: Founder Workflow",
        slug: "founder-workflow",
        readTime: "10 min",
        popularity: 86,
        lastUpdated: "2024-04-30",
      },
    ],
  },
];

const KnowledgeBasePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        !selectedCategory || category.title === selectedCategory
    );

  const sortArticles = (articles) => {
    switch (sortBy) {
      case "popular":
        return [...articles].sort((a, b) => b.popularity - a.popularity);
      case "recent":
        return [...articles].sort(
          (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
      case "title":
        return [...articles].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return articles;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="popular">Most Popular</option>
          <option value="recent">Recently Updated</option>
          <option value="title">Alphabetical</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  !selectedCategory ? "bg-primary/10 text-primary" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.title}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 ${
                    selectedCategory === category.title
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(category.title)}
                >
                  <div className="flex items-center">
                    {category.icon && (
                      <category.icon className="h-4 w-4 mr-2" />
                    )}
                    {category.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                Popular Articles
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-400" />
                Recently Updated
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                Scaling Startups
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3">
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  {category.icon && (
                    <category.icon className="h-5 w-5 mr-2" />
                  )}
                  {category.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {sortArticles(category.articles).map((article) => (
                    <a
                      key={article.id}
                      href={`/content/knowledge-base/${article.slug}`}
                      className="p-4 border rounded-lg hover:border-primary/50 transition-colors group"
                    >
                      <h3 className="font-medium group-hover:text-primary mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {article.popularity}% useful
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.every((cat) => cat.articles.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No articles found matching your search.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
