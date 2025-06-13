from dataclasses import dataclass
from typing import Optional, Literal

@dataclass
class WebSearchTool:
    """A hosted tool that lets the LLM search the web. Currently only supported with OpenAI models, using the Responses API."""

    user_location: Optional[dict] = None
    """Optional location for the search. Lets you customize results to be relevant to a location."""

    search_context_size: Literal["low", "medium", "high"] = "medium"
    """The amount of context to use for the search."""

    @property
    def name(self):
        return "web_search_preview"

    def execute(self, query: str) -> dict:
        """Execute a web search query."""
        # Placeholder implementation (replace with actual web search API logic)
        location_info = f" in {self.user_location}" if self.user_location else ""
        return {
            "tool": "web_search_preview",
            "query": query,
            "results": f"Mock web search results for {query}{location_info}"
        }