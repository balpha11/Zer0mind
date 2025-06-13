import { useState } from "react";
import { Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import Breadcrumb from "@/components/content/Breadcrumb";

const faqCategories = [
  {
    id: 1,
    name: "Getting Started",
    questions: [
      {
        id: 1,
        question: "What is an AI agent?",
        answer: "An AI agent is a software program that uses artificial intelligence to perform tasks or make decisions autonomously. In our platform, agents can be configured to handle various tasks such as customer support, data analysis, and process automation.",
        helpful: 156,
        notHelpful: 12,
        tags: ["basics", "ai", "definition"],
      },
      {
        id: 2,
        question: "How do I create my first agent?",
        answer: "To create your first agent:\n1. Navigate to the Agents dashboard\n2. Click the 'New Agent' button\n3. Choose a template or start from scratch\n4. Configure basic settings like name and description\n5. Set up the agent's capabilities and parameters\n6. Test and deploy your agent",
        helpful: 234,
        notHelpful: 8,
        tags: ["getting-started", "creation", "setup"],
      },
      // ... more questions
    ],
  },
  {
    id: 2,
    name: "Account & Billing",
    questions: [
      {
        id: 3,
        question: "How is usage calculated?",
        answer: "Usage is calculated based on several factors:\n- Number of API calls\n- Processing time\n- Data storage\n- Number of active agents\n\nYou can monitor your usage in real-time from the billing dashboard.",
        helpful: 189,
        notHelpful: 15,
        tags: ["billing", "usage", "pricing"],
      },
      // ... more questions
    ],
  },
  // ... more categories
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [copiedAnswer, setCopiedAnswer] = useState(null);
  const [feedback, setFeedback] = useState({});

  const toggleQuestion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const copyToClipboard = async (text, questionId) => {
    await navigator.clipboard.writeText(text);
    setCopiedAnswer(questionId);
    setTimeout(() => setCopiedAnswer(null), 2000);
  };

  const handleFeedback = (questionId, isHelpful) => {
    if (!feedback[questionId]) {
      setFeedback({
        ...feedback,
        [questionId]: isHelpful,
      });
    }
  };

  const filterQuestions = () => {
    let questions = [];
    faqCategories.forEach(category => {
      if (selectedCategory === "all" || selectedCategory === category.name) {
        questions = [...questions, ...category.questions];
      }
    });

    return questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const QuestionCard = ({ question }) => {
    const isExpanded = expandedQuestions.has(question.id);
    const userFeedback = feedback[question.id];

    return (
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50"
          onClick={() => toggleQuestion(question.id)}
        >
          <span className="font-medium">{question.question}</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="prose prose-sm max-w-none">
              {question.answer.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">Was this helpful?</div>
                <button
                  className={`p-1 rounded-lg hover:bg-gray-100 ${
                    userFeedback === true ? "text-green-500" : "text-gray-400"
                  }`}
                  onClick={() => handleFeedback(question.id, true)}
                  disabled={userFeedback !== undefined}
                >
                  <ThumbsUp className="h-5 w-5" />
                </button>
                <button
                  className={`p-1 rounded-lg hover:bg-gray-100 ${
                    userFeedback === false ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={() => handleFeedback(question.id, false)}
                  disabled={userFeedback !== undefined}
                >
                  <ThumbsDown className="h-5 w-5" />
                </button>
                <div className="text-sm text-gray-500">
                  {question.helpful} found this helpful
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(question.answer, question.id)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                {copiedAnswer === question.id ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Find answers to common questions about our platform and AI agents
        </p>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {faqCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filterQuestions().map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}

        {filterQuestions().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No questions found matching your search.
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t text-center">
        <h2 className="text-lg font-semibold mb-2">Still have questions?</h2>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Please contact our support team.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQPage; 