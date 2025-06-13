import json
import sys
import os
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from app.database.mongo import agents_collection, api_keys_collection

def create_startup_agent():
    # Load the agent configuration
    with open(Path(__file__).parent.parent / 'startup_agent.json', 'r') as f:
        agent_config = json.load(f)
    
    # Check if agent already exists
    existing_agent = agents_collection.find_one({"name": agent_config["name"]})
    if existing_agent:
        print(f"Agent '{agent_config['name']}' already exists with ID: {existing_agent['_id']}")
        return str(existing_agent["_id"])

    # Get OpenAI API key from environment
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")

    # Store API key in api_keys collection
    api_key_result = api_keys_collection.insert_one({
        "name": "OpenAI API Key for StartupCopilot",
        "key_secret": openai_api_key,
        "created_at": datetime.utcnow()
    })

    # Add API key reference and creation timestamp to agent config
    agent_config["openai_api_key_id"] = str(api_key_result.inserted_id)
    agent_config["created_at"] = datetime.utcnow()

    # Create the agent
    result = agents_collection.insert_one(agent_config)
    agent_id = str(result.inserted_id)
    print(f"Created StartupCopilot agent with ID: {agent_id}")
    return agent_id

if __name__ == "__main__":
    try:
        agent_id = create_startup_agent()
        print("Successfully created the StartupCopilot agent!")
        print(f"Use this agent_id when sending messages: {agent_id}")
    except Exception as e:
        print(f"Error creating agent: {str(e)}")
        sys.exit(1) 