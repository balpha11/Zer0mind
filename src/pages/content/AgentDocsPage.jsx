/* ─────────────────────────────────────────────────────────────
 *  AgentDocsPage.jsx  –  Zer0Mind built-in agent documentation
 *  Shows: overview • configuration • API • code examples
 * ──────────────────────────────────────────────────────────── */

import Breadcrumb from "@/components/content/Breadcrumb";
import {
  Check,
  ChevronRight,
  Copy,
  Search,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------
 *  Mock data (replace with API call if/when backend is ready)
 * ---------------------------------------------------------- */
const mockAgents = [
  /* 1️⃣ Startup Idea Validator */
  {
    id: 1,
    name: "Startup Idea Validator",
    description:
      "Evaluates startup ideas based on problem-solution fit, target market, uniqueness, and feasibility.",
    category: "Startup",
    version: "1.0.0",
    lastUpdated: "2025-06-10",
    author: "Zer0Mind AI",
    capabilities: [
      "Problem-solution fit analysis",
      "Feasibility estimation",
      "Target-market matching",
      "Uniqueness scoring",
    ],
    configuration: {
      model: "gpt-4",
      temperature: 0.6,
      maxTokens: 2048,
    },
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/agents/validator/evaluate",
        description: "Evaluate a startup idea",
        parameters: {
          problem: "string",
          solution: "string",
          audience: "string",
        },
      },
    ],
    examples: [
      {
        title: "Validate an ed-tech idea",
        code: `await fetch('/api/v1/agents/validator/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    problem: 'Lack of personalised learning in schools',
    solution: 'AI-driven adaptive learning platform',
    audience: 'Indian K-12 students'
  })
});`,
      },
    ],
  },

  /* 2️⃣ Pitch Deck Creator */
  {
    id: 2,
    name: "Pitch Deck Creator",
    description:
      "Generates complete investor pitch decks, including slides for problem, solution, market size, and business model.",
    category: "Startup",
    version: "1.0.0",
    lastUpdated: "2025-06-10",
    author: "Zer0Mind AI",
    capabilities: [
      "Slide generation",
      "Investor-friendly summaries",
      "Downloadable deck export",
    ],
    configuration: {
      model: "gpt-4",
      temperature: 0.5,
      maxTokens: 4096,
    },
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/agents/pitchdeck/create",
        description: "Create a full pitch deck",
        parameters: {
          businessIdea: "string",
          industry: "string",
        },
      },
    ],
    examples: [
      {
        title: "Create deck for a health-tech app",
        code: `await fetch('/api/v1/agents/pitchdeck/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessIdea: 'AI-driven remote physiotherapy platform',
    industry: 'HealthTech'
  })
});`,
      },
    ],
  },

  /* 3️⃣ Market Research Analyst */
  {
    id: 3,
    name: "Market Research Analyst",
    description:
      "Gathers competitor insights, industry trends, customer pain points, and SWOT analysis.",
    category: "Research",
    version: "1.0.0",
    lastUpdated: "2025-06-10",
    author: "Zer0Mind AI",
    capabilities: [
      "Competitor comparison",
      "SWOT analysis",
      "Industry-trend summarisation",
      "Customer pain-point extraction",
    ],
    configuration: {
      model: "gpt-4",
      temperature: 0.4,
      maxTokens: 3000,
    },
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/agents/research/analyse",
        description: "Perform market analysis",
        parameters: {
          industry: "string",
          region: "string?",
          competitors: "string[]?",
        },
      },
    ],
    examples: [
      {
        title: "Analyse Indian EV charging market",
        code: `await fetch('/api/v1/agents/research/analyse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    industry: 'EV charging', region: 'India'
  })
});`,
      },
    ],
  },

  /* 4️⃣ Business Model Designer */
  {
    id: 4,
    name: "Business Model Designer",
    description:
      "Helps define revenue streams, value propositions and cost structures using Business Model Canvas logic.",
    category: "Strategy",
    version: "1.0.0",
    lastUpdated: "2025-06-10",
    author: "Zer0Mind AI",
    capabilities: [
      "Canvas completion",
      "Revenue-stream suggestions",
      "Cost-structure mapping",
    ],
    configuration: {
      model: "gpt-4",
      temperature: 0.45,
      maxTokens: 2500,
    },
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/agents/model/design",
        description: "Generate a business model canvas",
        parameters: {
          idea: "string",
          audience: "string",
        },
      },
    ],
    examples: [
      {
        title: "Model for subscription SaaS",
        code: `await fetch('/api/v1/agents/model/design', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idea: 'Automated HR compliance software',
    audience: 'SMBs'
  })
});`,
      },
    ],
  },

  /* 5️⃣ Brand Name & Logo Generator */
  {
    id: 5,
    name: "Brand Name & Logo Generator",
    description:
      "Suggests unique, brand-able names and generates initial logo mock-ups.",
    category: "Branding",
    version: "1.0.0",
    lastUpdated: "2025-06-10",
    author: "Zer0Mind AI",
    capabilities: [
      "Brand-name ideation",
      "Domain availability check",
      "Basic logo mock-up",
    ],
    configuration: {
      model: "gpt-4",
      temperature: 0.8,
      maxTokens: 1500,
    },
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/agents/branding/generate",
        description: "Generate brand name and logo",
        parameters: {
          keywords: "string[]",
          style: "string",
        },
      },
    ],
    examples: [
      {
        title: "Brand ideas for fintech app",
        code: `await fetch('/api/v1/agents/branding/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    keywords: ['secure', 'easy', 'money'],
    style: 'modern'
  })
});`,
      },
    ],
  },
];

/* ------------------------------------------------------------ */

const AgentDocsPage = () => {
  const [agents, setAgents] = useState(mockAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [copiedId, setCopiedId] = useState(null);

  /* Search filter */
  useEffect(() => {
    const filtered = mockAgents.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setAgents(filtered);
  }, [searchQuery]);

  /* Copy helper */
  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  /* --- Agent detail component --- */
  const AgentDetail = ({ agent }) => (
    <div className="space-y-6">
      {/* Header */}
      <header className="border-b pb-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">{agent.name}</h2>
            <p className="text-gray-600">{agent.description}</p>
          </div>
          <div className="text-sm text-gray-500 space-y-1 text-right">
            <div>v{agent.version}</div>
            <div>Updated {agent.lastUpdated}</div>
            <div>By {agent.author}</div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b">
        {["overview", "configuration", "api", "examples"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`py-4 px-2 text-sm font-medium border-b-2 ${
              selectedTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      {selectedTab === "overview" && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Capabilities</h3>
          <ul className="grid grid-cols-2 gap-3">
            {agent.capabilities.map((c, i) => (
              <li key={i} className="flex items-center">
                <Zap className="w-4 h-4 text-primary mr-2" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {selectedTab === "configuration" && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Configuration</h3>
          <pre className="bg-gray-50 rounded-lg p-4 text-sm">
            {JSON.stringify(agent.configuration, null, 2)}
          </pre>
        </section>
      )}

      {selectedTab === "api" && (
        <section>
          <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
          <div className="space-y-4">
            {agent.endpoints.map((ep, idx) => (
              <div key={idx} className="border rounded-lg">
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-mono text-xs px-2 py-1 rounded ${
                        ep.method === "GET"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm">{ep.path}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(ep.path, `ep-${idx}`)}
                    className="text-gray-500 hover:text-primary"
                  >
                    {copiedId === `ep-${idx}` ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="p-4 text-sm space-y-2">
                  <p className="text-gray-600">{ep.description}</p>
                  {ep.parameters && (
                    <>
                      <h4 className="font-medium">Parameters:</h4>
                      {Object.entries(ep.parameters).map(([k, v]) => (
                        <div key={k} className="flex">
                          <span className="font-mono text-primary">{k}</span>
                          <span className="mx-2">:</span>
                          <span className="font-mono text-gray-600">{v}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedTab === "examples" && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Code Examples</h3>
          {agent.examples.map((ex, idx) => (
            <div key={idx} className="mb-6">
              <h4 className="font-medium mb-1">{ex.title}</h4>
              <div className="relative bg-gray-50 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{ex.code}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(ex.code, `ex-${idx}`)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-primary"
                >
                  {copiedId === `ex-${idx}` ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  /* --- Page layout --- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb />

      <div className="flex h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r pr-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search agents…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {agents.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setSelectedAgent(a);
                  setSelectedTab("overview");
                }}
                className={`w-full flex justify-between px-3 py-2 rounded-lg text-left hover:bg-gray-100 ${
                  selectedAgent?.id === a.id ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <span>{a.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 pl-8 overflow-y-auto">
          {selectedAgent ? (
            <AgentDetail agent={selectedAgent} />
          ) : (
            <div className="text-center text-gray-500 mt-10">
              Select an agent to view its documentation
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AgentDocsPage;
