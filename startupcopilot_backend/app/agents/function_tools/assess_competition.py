# app/agents/function_tools/assess_competition.py

"""
Function Tool: assess_competition

Analyzes the competitive landscape based on structured input.
"""

from typing import Dict, List, TypedDict


class CompetitorQueryOptions(TypedDict):
    num_insights: int
    include_funding: bool
    include_traffic: bool


class CompetitorQuery(TypedDict):
    competitors: List[str]
    options: CompetitorQueryOptions


async def assess_competition(query: CompetitorQuery) -> Dict[str, str]:
    """
    Analyzes competitors based on a query object with options.

    Args:
        query: A dictionary with a list of competitor names and analysis options.

    Returns:
        A dictionary mapping each competitor to a basic analysis summary.
    """
    competitors = query.get("competitors", [])
    opts = query.get("options", {})

    if not competitors:
        return {"error": "No competitors provided for analysis."}

    insights = {}
    for name in competitors:
        text = f"{name}: Market presence noted"
        if opts.get("include_funding"):
            text += ", funding info [placeholder]"
        if opts.get("include_traffic"):
            text += ", web traffic data [placeholder]"
        insights[name] = text

    return insights
