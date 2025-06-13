from typing import List, Optional, Dict, Any
import openai
from openai import OpenAI

class Agent:
    def __init__(
        self,
        model: str = "gpt-4",
        api_key: str = None,
        system_prompt: str = "You are a helpful assistant.",
        tools: List[str] = None,
    ):
        self.model = model
        self.system_prompt = system_prompt
        self.tools = tools or []
        self.client = OpenAI(api_key=api_key)

    def run(self, input_text: str) -> Dict[str, Any]:
        """
        Run the agent with the given input text.
        Returns a dictionary containing the response and any additional data.
        """
        try:
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": input_text}
            ]

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=2000,
            )

            # Extract the assistant's message
            assistant_message = response.choices[0].message.content

            return {
                "final_output": assistant_message,
                "raw_response": response.model_dump(),
                "status": "success"
            }
        except Exception as e:
            return {
                "final_output": f"Error: {str(e)}",
                "status": "error",
                "error": str(e)
            } 