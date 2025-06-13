from dataclasses import dataclass
from typing import Optional, Callable, Any
from typing_extensions import Awaitable

@dataclass
class HostedMCPTool:
    """A tool that allows the LLM to use a remote MCP server. The LLM will automatically list and
    call tools, without requiring a round trip back to your code."""

    tool_config: dict
    """The MCP tool config, which includes the server URL and other settings."""

    on_approval_request: Optional[Callable[[Any], Awaitable[Any]]] = None
    """An optional function that will be called if approval is requested for an MCP tool."""

    @property
    def name(self):
        return "hosted_mcp"

    async def execute(self, command: str, params: dict = None) -> dict:
        """Execute a command on the remote MCP server.

        Args:
            command: The command to execute on the MCP server.
            params: Parameters for the command.

        Returns:
            A dictionary with the command result or error message.
        """
        # Placeholder: Replace with actual MCP server API call
        try:
            params = params or {}
            server_url = self.tool_config.get("server_url", "unknown")
            result = f"Mock MCP command '{command}' executed on {server_url} with params: {params}"
            if self.on_approval_request:
                # Simulate approval request
                approval_result = await self.on_approval_request({"command": command, "params": params})
                result += f"; Approval: {approval_result}"
            return {
                "tool": "hosted_mcp",
                "command": command,
                "output": result,
                "error": None
            }
        except Exception as e:
            return {
                "tool": "hosted_mcp",
                "command": command,
                "output": None,
                "error": f"Command failed: {str(e)}"
            }