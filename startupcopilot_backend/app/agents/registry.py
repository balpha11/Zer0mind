# app/agents/registry.py

import inspect
from agents import Agent    # your actual Agent class
from app.database.mongo import agents_collection


class Runner:
    @staticmethod
    def run(agent: Agent, input: str):
        """
        Executes an agent with the given input. Handles async and sync results.
        """
        try:
            result = agent.run(input)
            if inspect.isawaitable(result):
                return result  # Await this in agent_runner.py
            return result
        except Exception as e:
            raise RuntimeError(f"Runner.run() error: {str(e)}")


async def load_agents():
    """
    Optional utility function to preload all active agents from MongoDB.
    """
    cursor = agents_collection.find({"status": "active"})
    agents = await cursor.to_list(length=None)

    agent_objects = {}
    for agent_data in agents:
        agent = Agent(
            name=agent_data["name"],
            instructions=agent_data.get("instructions", "You are a helpful assistant."),
            tools=agent_data.get("tools", []),
            model=agent_data.get("model", "gpt-4o"),
            model_settings=agent_data.get("model_settings", {}),
            openai_api_key=None  # You may load this separately if needed
        )
        key = agent.name.lower().replace(" ", "_")
        agent_objects[key] = agent

    return agent_objects
