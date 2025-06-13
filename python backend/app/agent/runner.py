from typing import Any, Union, Dict
from .base import Agent

class Runner:
    @staticmethod
    def run(agent: Agent, input: str) -> Union[str, Dict[str, Any]]:
        """
        Run the agent with the given input.
        
        Args:
            agent: The agent instance to run
            input: The user input to process
            
        Returns:
            Either a string response or a dictionary containing the response
        """
        try:
            return agent.process(input)
        except Exception as e:
            raise RuntimeError(f"Error running agent: {str(e)}") 