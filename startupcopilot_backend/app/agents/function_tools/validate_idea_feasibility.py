# validate_idea_feasibility.py

"""
Function Tool: validate_idea_feasibility

Evaluates the feasibility of a startup idea based on the problem, proposed solution, and target audience.
This version uses basic logic and heuristics; in production, you might combine this with AI model scoring.
"""

from typing import Dict


async def validate_idea_feasibility(problem: str, solution: str, target_audience: str) -> Dict[str, str]:
    """
    Assess feasibility of a startup idea.

    Args:
        problem (str): The core problem being addressed.
        solution (str): The proposed solution to the problem.
        target_audience (str): The main group of users/customers.

    Returns:
        Dict[str, str]: Result summary with feasibility assessment.
    """
    if not problem or not solution or not target_audience:
        return {
            "status": "error",
            "message": "All fields (problem, solution, target_audience) are required."
        }

    feedback = []

    # Heuristic checks
    if len(problem) < 20:
        feedback.append("The problem statement seems too brief or underdeveloped.")

    if len(solution) < 20:
        feedback.append("The solution description lacks depth or implementation clarity.")

    if not any(term in target_audience.lower() for term in ["consumer", "startup", "business", "enterprise", "student", "developer"]):
        feedback.append("Target audience may be unclear or too broad. Be specific.")

    score = 100
    if len(feedback) >= 2:
        score = 60
    elif len(feedback) == 1:
        score = 80

    return {
        "problem": problem,
        "solution": solution,
        "target_audience": target_audience,
        "feasibility_score": f"{score}/100",
        "summary": "Feasibility assessment completed.",
        "feedback": feedback or ["The idea appears feasible and well-described."]
    }
