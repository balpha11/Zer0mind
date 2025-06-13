from fastapi import APIRouter, HTTPException
from bson import ObjectId, errors as bson_errors
from datetime import datetime
import json
from app.schemas.tool import ToolCreate, ToolUpdate, ToolOut
from app.database.mongo import mongo_db
from app.agents.tools import AVAILABLE_FUNCTIONS
from app.agents.hosted_tools import HOSTED_TOOLS

router = APIRouter()
tools_collection = mongo_db["tools"]

# Validation rules for hosted tool configurations
HOSTED_TOOL_CONFIG_SCHEMA = {
    "FileSearchTool": {"required": ["vector_store_ids"], "optional": ["max_num_results", "include_search_results", "ranking_options", "filters"]},
    "WebSearchTool": {"required": [], "optional": ["user_location", "search_context_size"]},
    "CodeInterpreterTool": {"required": [], "optional": ["tool_config"]},
    "ComputerTool": {"required": ["computer"], "optional": []},
    "HostedMCPTool": {"required": ["tool_config"], "optional": ["on_approval_request"]},
    "ImageGenerationTool": {"required": [], "optional": ["tool_config"]},
    "LocalShellTool": {"required": [], "optional": ["executor"]}
}

def validate_hosted_tool_config(tool_name: str, config: dict):
    """Validate hosted tool configuration."""
    if tool_name not in HOSTED_TOOL_CONFIG_SCHEMA:
        raise HTTPException(status_code=400, detail=f"Unknown hosted tool: {tool_name}")
    
    schema = HOSTED_TOOL_CONFIG_SCHEMA[tool_name]
    params = config.get("params", {})
    
    # Check required fields
    for field in schema["required"]:
        if field not in params:
            raise HTTPException(status_code=400, detail=f"Missing required field '{field}' for {tool_name}")
    
    # Check for invalid fields
    allowed_fields = set(schema["required"] + schema["optional"])
    for field in params:
        if field not in allowed_fields:
            raise HTTPException(status_code=400, detail=f"Invalid field '{field}' for {tool_name}")

@router.get("/", response_model=list[ToolOut])
async def get_all_tools():
    tools = list(tools_collection.find())
    return [{"id": str(tool["_id"]), **tool} for tool in tools]

@router.get("/functions", response_model=list[str])
async def list_function_tools():
    return list(AVAILABLE_FUNCTIONS.keys())

@router.get("/hosted", response_model=list[dict])
async def list_hosted_tools():
    return HOSTED_TOOLS

@router.get("/functions/{function_name}/description", response_model=dict)
async def get_function_description(function_name: str):
    if function_name not in AVAILABLE_FUNCTIONS:
        raise HTTPException(status_code=404, detail="Function not found")
    func = AVAILABLE_FUNCTIONS[function_name]
    description = func.__doc__.strip() if func.__doc__ else "No description available"
    return {"description": description}

@router.post("/", response_model=ToolOut)
async def create_tool(tool: ToolCreate):
    if tools_collection.find_one({"name": tool.name}):
        raise HTTPException(status_code=400, detail="Tool with this name already exists")

    if tool.config:
        try:
            cfg = json.loads(tool.config)
            if tool.type == "function" and "function_name" not in cfg:
                raise HTTPException(status_code=400, detail="Function tools require a 'function_name'")
            if tool.type == "functions" and ("function_names" not in cfg or not isinstance(cfg["function_names"], list)):
                raise HTTPException(status_code=400, detail="Functions tools require a 'function_names' list")
            if tool.type == "functions":
                invalid_functions = [fn for fn in cfg["function_names"] if fn not in AVAILABLE_FUNCTIONS]
                if invalid_functions:
                    raise HTTPException(status_code=400, detail=f"Invalid function names: {invalid_functions}")
            if tool.type == "hosted" and "tool_name" not in cfg:
                raise HTTPException(status_code=400, detail="Hosted tools require a 'tool_name'")
            if tool.type == "hosted":
                valid_tools = [t["value"] for t in HOSTED_TOOLS]
                if cfg["tool_name"] not in valid_tools:
                    raise HTTPException(status_code=400, detail=f"Invalid hosted tool name: {cfg['tool_name']}")
                validate_hosted_tool_config(cfg["tool_name"], cfg)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Config must be valid JSON")

    tool_data = {**tool.dict(), "created_at": datetime.utcnow()}
    result = tools_collection.insert_one(tool_data)
    return {"id": str(result.inserted_id), **tool_data}

@router.put("/{tool_id}", response_model=ToolOut)
async def update_tool(tool_id: str, tool_update: ToolUpdate):
    try:
        if not ObjectId.is_valid(tool_id):
            raise HTTPException(status_code=400, detail="Invalid tool ID")
        
        existing_tool = tools_collection.find_one({"_id": ObjectId(tool_id)})
        if not existing_tool:
            raise HTTPException(status_code=404, detail="Tool not found")

        update_data = tool_update.dict(exclude_unset=True)
        if update_data.get("config"):
            try:
                cfg = json.loads(update_data["config"])
                tool_type = update_data.get("type", existing_tool["type"])
                if tool_type == "function" and "function_name" not in cfg:
                    raise HTTPException(status_code=400, detail="Function tools require a 'function_name'")
                if tool_type == "functions" and ("function_names" not in cfg or not isinstance(cfg["function_names"], list)):
                    raise HTTPException(status_code=400, detail="Functions tools require a 'function_names' list")
                if tool_type == "functions":
                    invalid_functions = [fn for fn in cfg["function_names"] if fn not in AVAILABLE_FUNCTIONS]
                    if invalid_functions:
                        raise HTTPException(status_code=400, detail=f"Invalid function names: {invalid_functions}")
                if tool_type == "hosted" and "tool_name" not in cfg:
                    raise HTTPException(status_code=400, detail="Hosted tools require a 'tool_name'")
                if tool_type == "hosted":
                    valid_tools = [t["value"] for t in HOSTED_TOOLS]
                    if cfg["tool_name"] not in valid_tools:
                        raise HTTPException(status_code=400, detail=f"Invalid hosted tool name: {cfg['tool_name']}")
                    validate_hosted_tool_config(cfg["tool_name"], cfg)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Config must be valid JSON")

        if update_data:
            tools_collection.update_one(
                {"_id": ObjectId(tool_id)},
                {"$set": {**update_data, "updated_at": datetime.utcnow()}}
            )
        
        updated_tool = tools_collection.find_one({"_id": ObjectId(tool_id)})
        return {"id": str(updated_tool["_id"]), **updated_tool}
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid tool ID")

@router.delete("/{tool_id}")
async def delete_tool(tool_id: str):
    try:
        if not ObjectId.is_valid(tool_id):
            raise HTTPException(status_code=400, detail="Invalid tool ID")
        
        result = tools_collection.delete_one({"_id": ObjectId(tool_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Tool not found")
        
        return {"message": "Tool deleted successfully"}
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid tool ID")