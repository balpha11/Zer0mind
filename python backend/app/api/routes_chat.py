from fastapi import APIRouter, HTTPException, Body
from app.services.agent_runner import AgentRunner
from app.database.mongo import agents_collection
from bson import ObjectId

router = APIRouter()
agent_runner = AgentRunner()

@router.get("/agents")
async def list_available_agents():
    """List all active agents available for chat."""
    agents = list(agents_collection.find({"status": "active"}, {
        "_id": 1,
        "name": 1,
        "description": 1,
        "type": 1,
    }))
    
    for agent in agents:
        agent["id"] = str(agent["_id"])
        del agent["_id"]
    
    return agents

@router.post("/agents/{agent_id}/run")
async def run_agent(agent_id: str, payload: dict = Body(...)):
    """
    Run an agent with the given input.
    Expected body: { "input": "your message here" }
    """
    user_input = payload.get("input")
    if not user_input:
        raise HTTPException(status_code=400, detail="Missing input text")

    output = await agent_runner.run_agent(agent_id, user_input)
    return {"output": output} 