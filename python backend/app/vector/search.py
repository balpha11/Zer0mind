from app.database.mongo import agents_collection

def search_agent_instructions(query: str, limit: int = 5):
    """
    Search for agent instructions in MongoDB using text search.
    """
    # Ensure a text index exists on the 'name' and 'instructions' fields
    agents_collection.create_index([("name", "text"), ("instructions", "text")])

    # Perform text search
    results = agents_collection.find(
        {"$text": {"$search": query}},
        {"name": 1, "instructions": 1, "_id": 0}  # Return only name and instructions
    ).limit(limit)

    return list(results)