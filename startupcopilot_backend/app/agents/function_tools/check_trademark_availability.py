# check_trademark_availability.py

"""
Function Tool: check_trademark_availability

Simulates checking the trademark availability of a brand name in a given region.
In a real scenario, you would connect to a trademark registry API like USPTO, EUIPO, or IP India.
"""

from typing import Dict


async def check_trademark_availability(brand_name: str, region: str) -> Dict[str, str]:
    """
    Simulate checking if a trademark is available for registration.

    Args:
        brand_name (str): The brand name to check.
        region (str): The region to check in (e.g., "India", "US", "EU").

    Returns:
        Dict[str, str]: Availability result and status explanation.
    """
    if not brand_name or not region:
        return {
            "status": "error",
            "message": "Both 'brand_name' and 'region' are required."
        }

    # Mock logic: pretend brand names starting with "Z" are taken
    if brand_name.lower().startswith("z"):
        return {
            "brand_name": brand_name,
            "region": region,
            "available": "No",
            "message": f"The brand name '{brand_name}' is already registered or in use in {region}."
        }
    else:
        return {
            "brand_name": brand_name,
            "region": region,
            "available": "Yes",
            "message": f"The brand name '{brand_name}' appears to be available for registration in {region}."
        }
