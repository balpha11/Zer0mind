# estimate_revenue.py

"""
Function Tool: estimate_revenue

Calculates potential revenue based on market size, market share, and price per unit.
"""

from typing import Dict


async def estimate_revenue(market_size: float, market_share: float, price_per_unit: float) -> Dict[str, str]:
    """
    Estimate revenue from market parameters.

    Args:
        market_size (float): The total addressable market size (number of potential users or units).
        market_share (float): Expected market share (in %).
        price_per_unit (float): Price per unit or per customer.

    Returns:
        Dict[str, str]: Estimated revenue and a readable explanation.
    """
    if market_size <= 0 or market_share <= 0 or price_per_unit <= 0:
        return {
            "status": "error",
            "message": "All inputs must be positive numbers."
        }

    try:
        share_decimal = market_share / 100.0
        customers = market_size * share_decimal
        revenue = customers * price_per_unit

        return {
            "estimated_revenue_usd": f"${revenue:,.2f}",
            "details": f"With a {market_share}% share of a market of {market_size:,} units at ${price_per_unit:.2f} per unit, your projected revenue is approximately ${revenue:,.2f}."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to estimate revenue: {str(e)}"
        }
