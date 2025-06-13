from fastapi import APIRouter, HTTPException, Query, Body
from app.schemas.agent import AgentCreate, AgentUpdate, AgentOut
from app.database.mongo import agents_collection
from bson import ObjectId, errors as bson_errors
from typing import List
from datetime import datetime

from app.services.agent_runner import AgentRunner

router = APIRouter()
agent_runner = AgentRunner()


@router.get("/", response_model=List[AgentOut])
def get_all_agents():
    agents = list(agents_collection.find({}, {
        "_id": 1,
        "name": 1,
        "description": 1,
        "instructions": 1,
        "version": 1,
        "status": 1,
        "type": 1,
        "handoffs": 1,
        "flow_ids": 1,
        "tools": 1,
        "guardrails": 1,
        "created_at": 1
    }))
    for agent in agents:
        agent["id"] = str(agent["_id"])
        del agent["_id"]
        agent.setdefault("handoffs", [])
        agent.setdefault("flow_ids", [])
        agent.setdefault("tools", [])
        agent.setdefault("guardrails", [])
    return agents


@router.post("/", response_model=AgentOut)
def create_agent(agent_data: AgentCreate):
    if agents_collection.find_one({"name": agent_data.name}):
        raise HTTPException(status_code=400, detail="Agent with this name already exists")

    now = datetime.utcnow()
    record = {
        **agent_data.dict(),
        "handoffs": agent_data.handoffs or [],
        "flow_ids": agent_data.flow_ids or [],
        "tools": agent_data.tools or [],
        "guardrails": agent_data.guardrails or [],
        "created_at": now,
    }

    result = agents_collection.insert_one(record)
    inserted_id = str(result.inserted_id)

    return {
        "id": inserted_id,
        "name": agent_data.name,
        "description": agent_data.description,
        "instructions": agent_data.instructions,
        "version": agent_data.version,
        "status": agent_data.status,
        "type": agent_data.type,
        "handoffs": agent_data.handoffs or [],
        "flow_ids": agent_data.flow_ids or [],
        "tools": agent_data.tools or [],
        "guardrails": agent_data.guardrails or [],
        "created_at": now
    }


@router.put("/{agent_id}", response_model=AgentOut)
def update_agent(agent_id: str, agent_data: AgentUpdate):
    try:
        object_id = ObjectId(agent_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid agent ID")

    existing = agents_collection.find_one({"_id": object_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_doc = agent_data.dict(exclude_unset=True)
    agents_collection.update_one(
        {"_id": object_id},
        {"$set": update_doc}
    )

    updated = agents_collection.find_one({"_id": object_id})
    updated.setdefault("handoffs", [])
    updated.setdefault("flow_ids", [])
    updated.setdefault("tools", [])
    updated.setdefault("guardrails", [])

    return {
        "id": str(updated["_id"]),
        "name": updated.get("name"),
        "description": updated.get("description"),
        "instructions": updated.get("instructions"),
        "version": updated.get("version"),
        "status": updated.get("status"),
        "type": updated.get("type"),
        "handoffs": updated.get("handoffs", []),
        "flow_ids": updated.get("flow_ids", []),
        "tools": updated.get("tools", []),
        "guardrails": updated.get("guardrails", []),
        "created_at": updated.get("created_at"),
    }


@router.delete("/{agent_id}")
def delete_agent(agent_id: str):
    try:
        object_id = ObjectId(agent_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid agent ID")

    result = agents_collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")

    return {"message": "Agent deleted successfully"}


@router.get("/search", response_model=List[dict])
def search_agents(q: str = Query(..., description="Search query text")):
    agents_collection.create_index([("name", "text"), ("instructions", "text")])

    results = agents_collection.find(
        {"$text": {"$search": q}},
        {
            "name": 1,
            "instructions": 1,
            "type": 1,
            "tools": 1,
            "guardrails": 1,
            "_id": 0
        }
    ).limit(5)

    return list(results)


@router.post("/{agent_id}/run")
async def run_agent(agent_id: str, payload: dict = Body(...)):
    """
    Executes an agent with the given ID using the provided user input.
    Expected body: { "input": "your message here" }
    """
    user_input = payload.get("input")
    if not user_input:
        raise HTTPException(status_code=400, detail="Missing input text")

    output = await agent_runner.run_agent(agent_id, user_input)
    return {"output": output}
