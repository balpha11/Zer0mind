from typing import Optional, Dict, List, Any
from typing_extensions import TypedDict
from pydantic import BaseModel
import json
import datetime
import logging

# Hosted tools
from app.agents.hosted_tools import (
    FileSearchTool,
    WebSearchTool,
    CodeInterpreterTool,
    ComputerTool,
    HostedMCPTool,
    ImageGenerationTool,
    LocalShellTool
)

# Startup idea validator tools
from app.agents.function_tools.assess_competition import assess_competition
from app.agents.function_tools.estimate_market_size import estimate_market_size as new_estimate_market_size
from app.agents.function_tools.estimate_revenue import estimate_revenue
from app.agents.function_tools.check_trademark_availability import check_trademark_availability
from app.agents.function_tools.validate_idea_feasibility import validate_idea_feasibility
from app.agents.function_tools.search_industry_trends import search_industry_trends

# Type definitions for function tools
class Location(TypedDict):
    lat: float
    long: float

class Customer(TypedDict):
    name: str
    email: str
    company: Optional[str]

class Task(TypedDict):
    title: str
    description: str
    due_date: str  # ISO format

class Competitor(TypedDict):
    name: str
    website: Optional[str]

# Sample function tools for general use
async def fetch_weather(location: Location) -> str:
    return f"Sunny at {location['lat']}, {location['long']}"

async def read_file(path: str, directory: Optional[str] = None) -> str:
    return f"Contents of {path} in {directory or 'default directory'}"

async def calculate_break_even_point(fixed_costs: float, variable_cost_per_unit: float, selling_price_per_unit: float) -> Dict[str, float]:
    if selling_price_per_unit <= variable_cost_per_unit:
        return {"error": "Selling price must be greater than variable cost"}
    break_even_units = fixed_costs / (selling_price_per_unit - variable_cost_per_unit)
    break_even_revenue = break_even_units * selling_price_per_unit
    return {
        "break_even_units": round(break_even_units, 2),
        "break_even_revenue": round(break_even_revenue, 2)
    }

async def draft_customer_email(customer: Customer, subject: str, tone: str = "professional") -> str:
    greetings = {
        "professional": f"Dear {customer['name']},",
        "friendly": f"Hi {customer['name']},",
        "urgent": f"Urgent: Dear {customer['name']},"
    }
    greeting = greetings.get(tone, greetings["professional"])
    company_line = f" at {customer['company']}" if customer.get('company') else ""
    return f"""
    {greeting}
    
    I hope this message finds you well{company_line}. [Insert your message here regarding {subject}].
    
    Best regards,
    Your StartupCopilot Team
    """

async def generate_task_summary(tasks: List[Task]) -> str:
    if not tasks:
        return "No tasks provided."
    summary = "Task Summary:\n"
    for i, task in enumerate(tasks, 1):
        try:
            due_date = datetime.datetime.fromisoformat(task['due_date']).strftime("%Y-%m-%d")
        except ValueError:
            due_date = "Invalid due date"
        summary += f"{i}. {task['title']} (Due: {due_date})\n   {task['description']}\n"
    return summary

async def analyze_competitor(competitor: Competitor) -> str:
    website_info = f"Website: {competitor['website']}" if competitor.get('website') else "No website provided"
    return f"""
    Competitor Analysis for {competitor['name']}:
    - {website_info}
    - [Placeholder: Add market position, strengths, weaknesses based on external data]
    """

# ✅ Unified function tool registry (including startup validator tools)
AVAILABLE_FUNCTIONS = {
    "fetch_weather": fetch_weather,
    "read_file": read_file,
    "calculate_break_even_point": calculate_break_even_point,
    "draft_customer_email": draft_customer_email,
    "generate_task_summary": generate_task_summary,
    "analyze_competitor": analyze_competitor,
    "estimate_market_size": new_estimate_market_size,  # Replace if preferred
    "assess_competition": assess_competition,
    "estimate_revenue": estimate_revenue,
    "check_trademark_availability": check_trademark_availability,
    "validate_idea_feasibility": validate_idea_feasibility,
    "search_industry_trends": search_industry_trends,
}

# 🔧 Hosted tool registry
HOSTED_TOOL_REGISTRY = {
    "file_search": FileSearchTool,
    "web_search_preview": WebSearchTool,
    "code_interpreter": CodeInterpreterTool,
    "computer_use_preview": ComputerTool,
    "hosted_mcp": HostedMCPTool,
    "image_generation": ImageGenerationTool,
    "local_shell": LocalShellTool
}

# 🛠️ Tool instance factory
def get_tool_instance(tool_name: str, config: dict) -> Any:
    if tool_name not in HOSTED_TOOL_REGISTRY:
        raise ValueError(f"Unknown tool: {tool_name}")
    tool_class = HOSTED_TOOL_REGISTRY[tool_name]
    return tool_class(**config.get("params", {}))
