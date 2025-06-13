import { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Users, Star, Clock, Filter, ThumbsUp, MessageCircle, Tag } from "lucide-react";
import Breadcrumb from "@/components/content/Breadcrumb";

const categories = [
  {
    id: 1,
    name: "General Discussion",
    description: "General topics about AI agents and the platform",
    icon: MessageSquare,
    color: "blue",
    topics: 156,
    posts: 1243,
  },
  {
    id: 2,
    name: "Technical Support",
    description: "Get help with technical issues and implementation",
    icon: Users,
    color: "green",
    topics: 89,
    posts: 567,
  },
  {
    id: 3,
    name: "Feature Requests",
    description: "Suggest and discuss new features",
    icon: Star,
    color: "yellow",
    topics: 45,
    posts: 234,
  },
  { id: 4, name: "Agent Development", count: 78 },
  { id: 5, name: "Best Practices", count: 34 },
];

const discussions = [
  {
    id: 1,
    title: "Best practices for training custom AI agents",
    content: "I'm looking for advice on the best approaches to train custom AI agents for specific use cases. Has anyone had success with particular methods or frameworks?",
    author: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    category: "General Discussion",
    tags: ["training", "best-practices", "custom-agents"],
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T14:45:00Z",
    views: 234,
    likes: 12,
    replies: 8,
    solved: true,
  },
  {
    id: 2,
    title: "Best practices for training custom agents",
    author: "Jane Smith",
    category: "Best Practices",
    replies: 8,
    views: 156,
    likes: 32,
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    title: "Feature request: Advanced workflow templates",
    author: "Mike Johnson",
    category: "Feature Requests",
    replies: 15,
    views: 289,
    likes: 67,
    timestamp: "1 day ago",
  },
];

// Add a helper to generate a random guest name
function getRandomGuest() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return {
    name: `Guest${num}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest${num}`,
  };
}

const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");
  const [selectedView, setSelectedView] = useState("discussions"); // categories, discussions
  const [guest, setGuest] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: categories[0]?.name || "", tags: "" });
  const [allDiscussions, setAllDiscussions] = useState(discussions);
  const [replies, setReplies] = useState({}); // { [discussionId]: [ { id, content, author, createdAt } ] }
  const [replyInputs, setReplyInputs] = useState({}); // { [discussionId]: string }
  const [votes, setVotes] = useState({}); // { [discussionId]: 1 | -1 | 0 }
  const [replyVotes, setReplyVotes] = useState({}); // { [replyId]: 1 | -1 | 0 }
  const [reactions, setReactions] = useState({}); // { [discussionId]: { emoji: count } }
  const [replyReactions, setReplyReactions] = useState({}); // { [replyId]: { emoji: count } }
  const [pinState, setPinState] = useState({}); // { [discussionId]: true/false }
  const [solvedState, setSolvedState] = useState({}); // { [discussionId]: true/false }
  const [reported, setReported] = useState({}); // { [id]: true }
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const listRef = useRef();

  // Move filterDiscussions here, before any useEffect
  const filterDiscussions = () => {
    return allDiscussions.filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (discussion.content && discussion.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(discussion.tags) && discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory = selectedCategory === "all" || discussion.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      switch (selectedSort) {
        case "recent":
          return new Date(b.updatedAt || b.timestamp) - new Date(a.updatedAt || a.timestamp);
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "mostLiked":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    // For demo, always assign a guest if not set
    if (!guest) {
      setGuest(getRandomGuest());
    }
  }, [guest]);

  // Simulate initial loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Infinite scroll effect (update to show loadingMore)
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight - scrollTop - clientHeight < 100 && !loadingMore && visibleCount < filterDiscussions().length) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setLoadingMore(false);
        }, 700);
      }
    };
    const ref = listRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => { if (ref) ref.removeEventListener("scroll", handleScroll); };
  }, [loadingMore, visibleCount, filterDiscussions]);

  const handleNewPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    setAllDiscussions([
      {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        tags: newPost.tags.split(",").map(t => t.trim()).filter(Boolean),
        author: guest,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        replies: 0,
        solved: false,
        pinned: false,
      },
      ...allDiscussions,
    ]);
    setShowNewModal(false);
    setNewPost({ title: "", content: "", category: categories[0]?.name || "", tags: "" });
  };

  const handleReplyChange = (discussionId, value) => {
    setReplyInputs({ ...replyInputs, [discussionId]: value });
  };

  const handleReplySubmit = (discussionId) => {
    const content = replyInputs[discussionId]?.trim();
    if (!content) return;
    const newReply = {
      id: Date.now(),
      content,
      author: guest,
      createdAt: new Date().toISOString(),
    };
    setReplies({
      ...replies,
      [discussionId]: [ ...(replies[discussionId] || []), newReply ]
    });
    setReplyInputs({ ...replyInputs, [discussionId]: "" });
  };

  const handleVote = (id, type, isReply = false) => {
    if (isReply) {
      setReplyVotes({ ...replyVotes, [id]: replyVotes[id] === type ? 0 : type });
    } else {
      setVotes({ ...votes, [id]: votes[id] === type ? 0 : type });
    }
  };

  const handleReaction = (id, emoji, isReply = false) => {
    if (isReply) {
      setReplyReactions({
        ...replyReactions,
        [id]: { ...replyReactions[id], [emoji]: (replyReactions[id]?.[emoji] || 0) + 1 },
      });
    } else {
      setReactions({
        ...reactions,
        [id]: { ...reactions[id], [emoji]: (reactions[id]?.[emoji] || 0) + 1 },
      });
    }
  };

  const handlePin = (id) => setPinState({ ...pinState, [id]: !pinState[id] });

  const handleSolved = (id) => setSolvedState({ ...solvedState, [id]: !solvedState[id] });

  const handleReport = (id) => setReported({ ...reported, [id]: true });

  const CategoryCard = ({ category }) => (
    <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg bg-${category.color}-100`}>
          <category.icon className={`h-6 w-6 text-${category.color}-500`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{category.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {category.topics} topics
            </span>
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {category.posts} posts
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const DiscussionCard = ({ discussion }) => (
    <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start space-x-4">
        <img
          src={discussion.author.avatar}
          alt={discussion.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-1 group-hover:text-primary">
                {discussion.title}
                {discussion.solved && (
                  <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Solved
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {discussion.content}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {Array.isArray(discussion.tags) && discussion.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(discussion.updatedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {discussion.likes}
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {discussion.replies}
              </span>
            </div>
            <div className="text-gray-500">
              {discussion.views} views
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {(replies[discussion.id] || []).map(reply => (
              <div key={reply.id} className="flex items-start space-x-2 bg-gray-50 rounded p-2">
                <img src={reply.author.avatar} alt={reply.author.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <button onClick={() => handleVote(reply.id, 1, true)} className={`px-2 py-1 rounded ${replyVotes[reply.id] === 1 ? 'bg-primary text-white' : 'bg-gray-100'}`}>▲</button>
                    <span>{(reply.likes || 0) + (replyVotes[reply.id] || 0)}</span>
                    <button onClick={() => handleVote(reply.id, -1, true)} className={`px-2 py-1 rounded ${replyVotes[reply.id] === -1 ? 'bg-primary text-white' : 'bg-gray-100'}`}>▼</button>
                    {["👍","❤️","😂","🎉"].map(emoji => (
                      <button key={emoji} onClick={() => handleReaction(reply.id, emoji, true)} className="px-1 text-lg">
                        {emoji} {replyReactions[reply.id]?.[emoji] || ""}
                      </button>
                    ))}
                    <button onClick={() => handleReport(reply.id)} className={`text-xs px-2 py-1 rounded ${reported[reply.id] ? 'bg-red-200' : 'bg-gray-100'}`}>{reported[reply.id] ? 'Reported' : 'Report'}</button>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{reply.author.name}</div>
                    <div className="text-gray-700 text-sm">{reply.content}</div>
                    <div className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
            <form onSubmit={e => { e.preventDefault(); handleReplySubmit(discussion.id); }} className="flex items-center space-x-2 mt-2">
              <img src={guest?.avatar} alt={guest?.name} className="w-8 h-8 rounded-full" />
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Write a reply..."
                value={replyInputs[discussion.id] || ""}
                onChange={e => handleReplyChange(discussion.id, e.target.value)}
              />
              <button type="submit" className="bg-primary text-white px-3 py-1 rounded text-sm">Reply</button>
            </form>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <button onClick={() => handlePin(discussion.id)} className={`text-xs px-2 py-1 rounded ${pinState[discussion.id] ? 'bg-yellow-200' : 'bg-gray-100'}`}>{pinState[discussion.id] ? 'Unpin' : 'Pin'}</button>
            <button onClick={() => handleSolved(discussion.id)} className={`text-xs px-2 py-1 rounded ${solvedState[discussion.id] ? 'bg-green-200' : 'bg-gray-100'}`}>{solvedState[discussion.id] ? 'Unsolve' : 'Mark as Solved'}</button>
            <button onClick={() => handleReport(discussion.id)} className={`text-xs px-2 py-1 rounded ${reported[discussion.id] ? 'bg-red-200' : 'bg-gray-100'}`}>{reported[discussion.id] ? 'Reported' : 'Report'}</button>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <button onClick={() => handleVote(discussion.id, 1)} className={`px-2 py-1 rounded ${votes[discussion.id] === 1 ? 'bg-primary text-white' : 'bg-gray-100'}`}>▲</button>
            <span>{(discussion.likes || 0) + (votes[discussion.id] || 0)}</span>
            <button onClick={() => handleVote(discussion.id, -1)} className={`px-2 py-1 rounded ${votes[discussion.id] === -1 ? 'bg-primary text-white' : 'bg-gray-100'}`}>▼</button>
            {["👍","❤️","😂","🎉"].map(emoji => (
              <button key={emoji} onClick={() => handleReaction(discussion.id, emoji)} className="px-1 text-lg">
                {emoji} {reactions[discussion.id]?.[emoji] || ""}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton component
  const SkeletonCard = () => (
    <div className="border rounded-lg p-6 animate-pulse bg-gray-100">
      <div className="h-4 w-1/3 bg-gray-300 rounded mb-4" />
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-1/4 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <div className="flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedView === "categories"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedView("categories")}
          >
            Categories
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedView === "discussions"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedView("discussions")}
          >
            Discussions
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90" onClick={() => setShowNewModal(true)}>
            New Discussion
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {selectedView === "discussions" && (
          <>
            <select
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Viewed</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </>
        )}
      </div>

      {selectedView === "categories" ? (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div ref={listRef} style={{ maxHeight: "70vh", overflowY: "auto" }} className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              {filterDiscussions()
                .sort((a, b) => (pinState[b.id] ? 1 : 0) - (pinState[a.id] ? 1 : 0))
                .slice(0, visibleCount)
                .map((discussion) => (
                  <div key={discussion.id} className={
                    `relative ${pinState[discussion.id] ? 'border-2 border-yellow-400 bg-yellow-50' : ''} ${solvedState[discussion.id] ? 'ring-2 ring-green-300' : ''}`
                  }>
                    <DiscussionCard discussion={discussion} />
                    {pinState[discussion.id] && <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded">PINNED</span>}
                    {solvedState[discussion.id] && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">SOLVED</span>}
                  </div>
                ))}
              {loadingMore && Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
              {visibleCount < filterDiscussions().length && !loadingMore && (
                <div className="text-center py-4 text-gray-400">Loading more...</div>
              )}
              {filterDiscussions().length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No discussions found matching your criteria.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleNewPost} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold mb-2">New Discussion</h2>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Title"
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <textarea
              className="w-full border rounded px-3 py-2 min-h-[100px]"
              placeholder="Content"
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              required
            />
            <select
              className="w-full border rounded px-3 py-2"
              value={newPost.category}
              onChange={e => setNewPost({ ...newPost, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Tags (comma separated)"
              value={newPost.tags}
              onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowNewModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Post</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForumPage; 