# tool_schemas_definitions.py

assess_competition_schema = {
    "type": "function",
    "name": "assess_competition",
    "description": "Analyzes the competitive landscape based on a list of competitor names or domains.",
    "parameters": {
        "type": "object",
        "properties": {
            "competitor_names": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "description": "List of competitor names or domains to analyze."
            }
        },
        "required": ["competitor_names"],
        "additionalProperties": False
    }
}

estimate_market_size_schema = {
    "type": "function",
    "name": "estimate_market_size",
    "description": "Estimates the market size for a given industry or target market in a region.",
    "parameters": {
        "type": "object",
        "properties": {
            "industry": {
                "type": "string",
                "description": "Industry or market segment (e.g., fintech, edtech)."
            },
            "region": {
                "type": "string",
                "description": "Geographical region (e.g., India, North America)."
            }
        },
        "required": ["industry", "region"],
        "additionalProperties": False
    }
}

estimate_revenue_schema = {
    "type": "function",
    "name": "estimate_revenue",
    "description": "Estimates potential revenue based on market size, expected share, and pricing.",
    "parameters": {
        "type": "object",
        "properties": {
            "market_size": {
                "type": "number",
                "description": "Estimated total market size in local currency (e.g., INR, USD)."
            },
            "market_share": {
                "type": "number",
                "description": "Expected percentage of market share to capture (0-100)."
            },
            "average_price": {
                "type": "number",
                "description": "Average price per unit or service sold."
            }
        },
        "required": ["market_size", "market_share", "average_price"],
        "additionalProperties": False
    }
}

check_trademark_availability_schema = {
    "type": "function",
    "name": "check_trademark_availability",
    "description": "Verifies if a brand name is available for trademark registration in a specific region.",
    "parameters": {
        "type": "object",
        "properties": {
            "brand_name": {
                "type": "string",
                "description": "The brand name to check."
            },
            "region": {
                "type": "string",
                "description": "The region or country for trademark search (e.g., India, US)."
            }
        },
        "required": ["brand_name", "region"],
        "additionalProperties": False
    }
}

validate_idea_feasibility_schema = {
    "type": "function",
    "name": "validate_idea_feasibility",
    "description": "Evaluates the feasibility of a startup idea based on the problem, solution, and target audience.",
    "parameters": {
        "type": "object",
        "properties": {
            "problem": {
                "type": "string",
                "description": "The problem the startup aims to solve."
            },
            "solution": {
                "type": "string",
                "description": "The proposed solution to the problem."
            },
            "target_audience": {
                "type": "string",
                "description": "The intended audience or customer base."
            }
        },
        "required": ["problem", "solution", "target_audience"],
        "additionalProperties": False
    }
}

search_industry_trends_schema = {
    "type": "function",
    "name": "search_industry_trends",
    "description": "Retrieves current industry trends for a specified sector.",
    "parameters": {
        "type": "object",
        "properties": {
            "industry": {
                "type": "string",
                "description": "The industry or sector to search (e.g., 'AI', 'fintech', 'education')."
            }
        },
        "required": ["industry"],
        "additionalProperties": False
    }
}
