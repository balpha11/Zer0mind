/* ─────────────────────────────────────────────────────────────
 *  TrainingPage.jsx  –  Agent Prompt Training (Zer0Mind)
 *  • Five built-in agents with prompt guidance & practice
 *  • Zer0Mind does NOT allow custom agents – reflected in UI
 * ──────────────────────────────────────────────────────────── */

import Breadcrumb from "@/components/content/Breadcrumb";
import {
  CheckCircle,
  Lightbulb,
  Search,
  XCircle
} from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------
 *  Training data – one entry per built-in agent
 * ---------------------------------------------------------- */
const agentTraining = [
  /* 1️⃣ Startup Idea Validator */
  {
    id: "idea-validator",
    name: "Startup Idea Validator",
    description:
      "Evaluates startup ideas for problem–solution fit, target market, uniqueness, and feasibility.",
    useCases: [
      "Validate new SaaS ideas before development",
      "Compare multiple concepts to pick the strongest",
      "Identify weaknesses in a business hypothesis"
    ],
    promptTips: [
      "Describe the problem in 1-2 sentences.",
      "Specify your assumed target audience.",
      "Mention any existing competitors you know."
    ],
    goodExample:
      "Validate my idea: an app that matches leftover restaurant food with nearby charities. Target: mid-sized city NGOs.",
    badExample: "Is my idea good?",
    practice: [
      {
        question:
          "Evaluate my idea of a subscription box for eco-friendly office supplies aimed at remote workers.",
        answer:
          "Strengths: rising remote-work trend, niche sustainability angle.\nWeaknesses: shipping cost vs. box price, need clear differentiation from regular stationery boxes.\nOverall feasibility: moderate if pricing and sourcing are optimized."
      }
    ]
  },

  /* 2️⃣ Pitch Deck Creator */
  {
    id: "pitch-deck",
    name: "Pitch Deck Creator",
    description:
      "Generates complete investor pitch decks with slides for problem, solution, market size, business model, and more.",
    useCases: [
      "Create a seed-stage investor deck quickly",
      "Refresh outdated pitch slides with new data",
      "Auto-generate talking points for demo day"
    ],
    promptTips: [
      "Provide core idea, traction metrics, and ask size (funding).",
      "Mention target market size or TAM if you have it.",
      "State preferred slide order if it matters."
    ],
    goodExample:
      "Create a 10-slide deck for my AI-based hiring platform. Traction: 50 paying customers, $12k MRR. Seeking $500k seed.",
    badExample: "Make me a deck.",
    practice: [
      {
        question:
          "Generate a slide outline for a tele-health startup serving rural India (seeking $1 M).",
        answer:
          "1) Title & logo\n2) Problem: rural doctor scarcity\n3) Solution: tele-health app\n4) Market size (rural pop.)\n5) Business model (subscription)\n6) Traction (pilot data)\n7) Competitive landscape\n8) Tech & regulatory moat\n9) Financial projections\n10) Ask & roadmap"
      }
    ]
  },

  /* 3️⃣ Market Research Analyst */
  {
    id: "market-research",
    name: "Market Research Analyst",
    description:
      "Gathers competitor insights, industry trends, customer pain points, and SWOT analysis.",
    useCases: [
      "Compile competitor feature matrices",
      "Summarize latest industry reports",
      "Produce SWOT or Porter’s Five Forces rundown"
    ],
    promptTips: [
      "State the industry and geography clearly.",
      "Ask for specific frameworks (SWOT, PESTLE…).",
      "Mention time range if trend data is needed."
    ],
    goodExample:
      "Give me a SWOT analysis of India’s EV two-wheeler charging market (last 3 years).",
    badExample: "Research EV industry.",
    practice: [
      {
        question: "List top 5 competitors for online coding bootcamps in the US.",
        answer:
          "1) Codecademy Pro\n2) Springboard\n3) Udacity Nanodegrees\n4) General Assembly\n5) Lambda School (BloomTech)\nIncludes brief USP and price points for each."
      }
    ]
  },

  /* 4️⃣ Business Model Designer */
  {
    id: "business-model",
    name: "Business Model Designer",
    description:
      "Helps define revenue streams, value propositions, and cost structures using Business Model Canvas logic.",
    useCases: [
      "Draft a Business Model Canvas for a new venture",
      "Identify additional revenue streams",
      "Clarify key partners & resources"
    ],
    promptTips: [
      "Describe product/service and main customer segments.",
      "Indicate current or planned revenue sources.",
      "Ask for suggestions on cost optimization."
    ],
    goodExample:
      "Design a business model canvas for a B2B SaaS that automates payroll compliance across ASEAN.",
    badExample: "Make a business model.",
    practice: [
      {
        question:
          "Suggest three new revenue streams for a freemium fitness-tracking app.",
        answer:
          "1) Branded merchandise\n2) Corporate wellness licensing\n3) Premium AI-based coaching subscription"
      }
    ]
  },

  /* 5️⃣ Brand Name & Logo Generator */
  {
    id: "branding",
    name: "Brand Name & Logo Generator",
    description:
      "Suggests unique, brand-able names and generates initial logo mock-ups.",
    useCases: [
      "Brainstorm catchy brand names with domain availability",
      "Generate logo ideas for an MVP landing page",
      "Create alternate taglines for A/B testing"
    ],
    promptTips: [
      "Give product purpose, tone (fun, luxury, techy…), and target audience.",
      "Mention language or cultural constraints (e.g., must sound good in Hindi).",
      "Include color or style preferences for logo suggestions."
    ],
    goodExample:
      "Propose 5 tech-savvy yet friendly brand names for a kids’ STEM toy line (must work in English & Hindi) + simple logo concepts.",
    badExample: "Need a name.",
    practice: [
      {
        question:
          "Generate two minimalist logo ideas for an eco-cleaning brand called 'PureLeaf'.",
        answer:
          "Idea A: Leaf outline forming a water droplet, soft green gradient.\nIdea B: Wordmark 'PureLeaf' with leaf vein cutting through the 'L', earth-tone palette."
      }
    ]
  }
];

/* ------------------------------------------------------------ */

const TrainingPage = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agentTraining.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ----- Small presentational components ----- */

  const AgentCard = ({ agent }) => (
    <button
      onClick={() => setSelectedAgent(agent)}
      className="border rounded-lg p-6 text-left hover:border-primary transition w-full"
    >
      <h3 className="text-xl font-semibold mb-1">{agent.name}</h3>
      <p className="text-gray-600">{agent.description}</p>
    </button>
  );

  const AgentDetails = ({ agent }) => (
    <div className="space-y-8">
      <button
        onClick={() => setSelectedAgent(null)}
        className="text-primary hover:underline"
      >
        ← Back to agents
      </button>

      <div>
        <h2 className="text-2xl font-bold mb-2">{agent.name}</h2>
        <p className="text-gray-600">{agent.description}</p>
      </div>

      {/* Use-cases */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Common Use Cases</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {agent.useCases.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Prompt tips */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Prompting Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {agent.promptTips.map((tip, idx) => (
            <li key={idx}>
              <Lightbulb className="inline w-4 h-4 mr-1 text-yellow-500" />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Examples */}
      <section className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Prompt Examples</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <CheckCircle className="text-green-600 h-5 w-5 inline mr-2" />
            <span className="text-gray-700">{agent.goodExample}</span>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <XCircle className="text-red-600 h-5 w-5 inline mr-2" />
            <span className="text-gray-700">{agent.badExample}</span>
          </div>
        </div>
      </section>

      {/* Practice */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Practice</h3>
        {agent.practice.map((p, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 mb-4 bg-white shadow-sm"
          >
            <div className="font-medium mb-1">User Prompt:</div>
            <p className="mb-3">{p.question}</p>
            <div className="font-medium mb-1">Ideal Agent Response:</div>
            <p className="text-gray-600 whitespace-pre-line">{p.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );

  /* ----- Render ----- */

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb />

      {selectedAgent ? (
        <AgentDetails agent={selectedAgent} />
      ) : (
        <>
          {/* Header + search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold">Agent Prompt Training</h1>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search agents…"
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Agent list */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No agents found matching your search.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrainingPage;
