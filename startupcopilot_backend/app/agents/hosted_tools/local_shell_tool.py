from dataclasses import dataclass
from typing import Callable, Optional
from typing_extensions import Awaitable

@dataclass
class LocalShellTool:
    """A tool that allows the LLM to execute commands on a shell."""

    executor: Optional[Callable[[dict], Awaitable[str]]] = None
    """A function that executes a command on a shell."""

    @property
    def name(self):
        return "local_shell"

    async def execute(self, command: str, params: dict = None) -> dict:
        """Execute a shell command.

        Args:
            command: The shell command to execute.
            params: Optional parameters for the command (e.g., environment variables).

        Returns:
            A dictionary with the command output or error message.
        """
        # Placeholder: Replace with actual shell execution logic (e.g., subprocess)
        try:
            params = params or {}
            result = f"Mock shell command executed: '{command}' with params: {params}"
            if self.executor:
                # Simulate executor call
                executor_result = await self.executor({"command": command, "params": params})
                result = executor_result
            return {
                "tool": "local_shell",
                "command": command,
                "output": result,
                "error": None
            }
        except Exception as e:
            return {
                "tool": "local_shell",
                "command": command,
                "output": None,
                "error": f"Command execution failed: {str(e)}"
            }