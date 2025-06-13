# app/agents/guardrails.py
from agents import Agent, GuardrailFunctionOutput, InputGuardrail
from app.services.agent_runner import run_agent_sync
from app.schemas.guardrail import GuardrailBase
from typing import Any

# Example output schema for evaluation
from pydantic import BaseModel

class HomeworkCheckOutput(BaseModel):
    is_homework: bool
    reasoning: str

# Dummy guardrail agent for demonstration
guardrail_agent = Agent(
    name="Homework Guardrail",
    instructions="Check if the user is asking a homework question",
    output_type=HomeworkCheckOutput,
)

def create_guardrail_function(logic_name: str):
    async def homework_guardrail(ctx, agent, input_data: str | list[Any]) -> GuardrailFunctionOutput:
        result = await run_agent_sync(guardrail_agent, input_data, context=ctx.context)
        output = result.final_output_as(HomeworkCheckOutput)
        return GuardrailFunctionOutput(
            output_info=output,
            tripwire_triggered=output.is_homework is False,
        )

    if logic_name == "check_for_homework":
        return InputGuardrail(guardrail_function=homework_guardrail)

    raise ValueError(f"Unknown guardrail logic: {logic_name}")
