from pydantic import BaseModel, validator
from typing import Optional
import json

class ToolBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str  # function, functions, hosted, agent
    config: Optional[str] = None  # JSON string

    @validator('type')
    def validate_type(cls, v):
        valid_types = ['function', 'functions', 'hosted', 'agent']
        if v not in valid_types:
            raise ValueError(f"Tool type must be one of {valid_types}")
        return v

    @validator('config')
    def validate_config(cls, v, values):
        if v is not None:
            try:
                json.loads(v)  # Ensure config is valid JSON
            except json.JSONDecodeError:
                raise ValueError("Config must be valid JSON")
            
            # Validate hosted tool config structure
            if values.get('type') == 'hosted':
                cfg = json.loads(v)
                if 'tool_name' not in cfg:
                    raise ValueError("Hosted tools require a 'tool_name' in config")
                # List of valid hosted tools (sync with HOSTED_TOOLS in routes_tools.py)
                valid_tools = [
                    'FileSearchTool', 'WebSearchTool', 'CodeInterpreterTool',
                    'ComputerTool', 'HostedMCPTool', 'ImageGenerationTool', 'LocalShellTool'
                ]
                if cfg['tool_name'] not in valid_tools:
                    raise ValueError(f"Invalid hosted tool name: {cfg['tool_name']}")
        return v

class ToolCreate(ToolBase):
    pass

class ToolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    config: Optional[str] = None

    @validator('type')
    def validate_type(cls, v):
        if v is not None:
            valid_types = ['function', 'functions', 'hosted', 'agent']
            if v not in valid_types:
                raise ValueError(f"Tool type must be one of {valid_types}")
        return v

    @validator('config')
    def validate_config(cls, v, values):
        if v is not None:
            try:
                json.loads(v)  # Ensure config is valid JSON
            except json.JSONDecodeError:
                raise ValueError("Config must be valid JSON")
            
            # Validate hosted tool config structure if type is provided
            if values.get('type') == 'hosted':
                cfg = json.loads(v)
                if 'tool_name' not in cfg:
                    raise ValueError("Hosted tools require a 'tool_name' in config")
                valid_tools = [
                    'FileSearchTool', 'WebSearchTool', 'CodeInterpreterTool',
                    'ComputerTool', 'HostedMCPTool', 'ImageGenerationTool', 'LocalShellTool'
                ]
                if cfg['tool_name'] not in valid_tools:
                    raise ValueError(f"Invalid hosted tool name: {cfg['tool_name']}")
        return v

class ToolOut(ToolBase):
    id: str  # MongoDB ObjectId as string