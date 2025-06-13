from typing import Optional
from bson import ObjectId
from fastapi import HTTPException
from app.agent.base import Agent
from app.agent.runner import Runner
from app.database.mongo import agents_collection, api_keys_collection
import inspect
import logging

# Configure logging
logger = logging.getLogger(__name__)

class AgentRunner:
    def __init__(self):
        self.agents_collection = agents_collection
        self.api_keys_collection = api_keys_collection

    async def _get_openai_api_key(self, api_key_id: str | None) -> Optional[str]:
        if not api_key_id:
            logger.warning("No OpenAI API key ID provided")
            return None
        try:
            doc = self.api_keys_collection.find_one({"_id": ObjectId(api_key_id)})
            if not doc:
                logger.error(f"No API key found for ID: {api_key_id}")
                return None
            return doc.get("key_secret")
        except Exception as exc:
            logger.error(f"Error fetching OpenAI key {api_key_id}: {exc}", exc_info=True)
            return None

    async def build_agent_from_model(self, agent_doc: dict) -> Agent:
        try:
            openai_api_key = await self._get_openai_api_key(agent_doc.get("openai_api_key_id"))
            if not openai_api_key:
                logger.error(f"Invalid or missing OpenAI API key for agent: {agent_doc.get('_id')}")
                raise HTTPException(status_code=400, detail="Invalid or missing OpenAI API key")

            return Agent(
                model=agent_doc.get("model", "gpt-4"),
                api_key=openai_api_key,
                system_prompt=agent_doc.get("instructions", ""),  # Use instructions as system prompt
                tools=agent_doc.get("tools", []),
            )
        except Exception as exc:
            logger.error(f"Error building agent from model: {exc}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Failed to build agent: {exc}")

    async def run_agent(self, agent_id: str, user_input: str) -> str:
        logger.debug(f"Running agent with ID: {agent_id}, Input: {user_input}")
        if not ObjectId.is_valid(agent_id):
            logger.error(f"Invalid agent ID: {agent_id}")
            raise HTTPException(status_code=400, detail="Invalid agent ID")
        if not user_input:
            logger.error("Input is empty")
            raise HTTPException(status_code=400, detail="Input must be non-empty")

        agent_doc = self.agents_collection.find_one({"_id": ObjectId(agent_id)})
        if not agent_doc:
            logger.error(f"Agent not found for ID: {agent_id}")
            raise HTTPException(status_code=404, detail="Agent not found")

        agent = await self.build_agent_from_model(agent_doc)

        try:
            result = Runner.run(agent, input=user_input)
            if inspect.isawaitable(result):
                result = await result

            if isinstance(result, dict):
                output = result.get("final_output", "[No output]")
            else:
                output = getattr(result, "final_output", "[No output]")

            logger.debug(f"Agent output: {output}")
            return str(output)
        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Agent execution failed for ID {agent_id}: {exc}", exc_info=True)
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Agent execution failed: {exc}")