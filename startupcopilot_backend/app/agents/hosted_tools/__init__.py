from .file_search_tool import FileSearchTool
from .web_search_tool import WebSearchTool
from .computer_tool import ComputerTool
from .code_interpreter_tool import CodeInterpreterTool
from .hosted_mcp_tool import HostedMCPTool
from .image_generation_tool import ImageGenerationTool
from .local_shell_tool import LocalShellTool

HOSTED_TOOLS = [
    {
        "value": "FileSearchTool",
        "label": "File Search Tool – Retrieve info from vector stores.",
        "description": "A hosted tool that lets the LLM search through a vector store."
    },
    {
        "value": "WebSearchTool",
        "label": "Web Search Tool – Search the web for relevant data.",
        "description": "A hosted tool that lets the LLM search the web."
    },
    {
        "value": "ComputerTool",
        "label": "Computer Tool – Automate computer-use tasks.",
        "description": "A hosted tool that lets the LLM control a computer."
    },
    {
        "value": "CodeInterpreterTool",
        "label": "Code Interpreter – Execute code in a sandbox.",
        "description": "A tool that allows the LLM to execute code in a sandboxed environment."
    },
    {
        "value": "HostedMCPTool",
        "label": "Hosted MCP Tool – Expose remote MCP server tools.",
        "description": "A tool that allows the LLM to use a remote MCP server."
    },
    {
        "value": "ImageGenerationTool",
        "label": "Image Generation – Generate images from prompts.",
        "description": "A tool that allows the LLM to generate images."
    },
    {
        "value": "LocalShellTool",
        "label": "Local Shell Tool – Run shell commands on host.",
        "description": "A tool that allows the LLM to execute commands on a shell."
    }
]