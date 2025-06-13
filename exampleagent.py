# agents_demo.py

import asyncio
from dataclasses import dataclass
from typing import List
from pydantic import BaseModel
from agents import Agent, Runner, ModelSettings, InputGuardrail, GuardrailFunctionOutput, function_tool

# 🔧 Tool definition
@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny"

# 📦 Pydantic output type
class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: List[str]

# 👤 Custom context
@dataclass
class UserContext:
    uid: str
    name: str
    is_pro_user: bool

    async def fetch_purchases(self) -> List[str]:
        return ["GPT-4 subscription", "Calendar Pro"]

# 🧠 Dynamic instructions function
def dynamic_instructions(ctx, agent) -> str:
    return f"Hello {ctx.context.name}. You are a {'Pro' if ctx.context.is_pro_user else 'Free'} user. How can I help you today?"

# 📅 Calendar extraction agent (with output_type)
calendar_agent = Agent[UserContext](
    name="Calendar extractor",
    instructions="Extract calendar events from natural language",
    output_type=CalendarEvent,
)

# 🌤️ Haiku weather agent using a tool
haiku_agent = Agent(
    name="Haiku agent",
    instructions="Always respond in haiku form",
    model="o3-mini",  # mini model for speed
    model_settings=ModelSettings(temperature=0.7),
    tools=[get_weather],
)

# 📞 Refund and Booking agents (dummy for handoffs)
refund_agent = Agent(
    name="Refund Agent",
    instructions="You help users with refunds for any purchases they've made.",
)

booking_agent = Agent(
    name="Booking Agent",
    instructions="You help users book appointments or services.",
)

# 🤖 Triage agent using dynamic instructions + handoffs
triage_agent = Agent[UserContext](
    name="Triage Agent",
    instructions=dynamic_instructions,
    handoffs=[refund_agent, booking_agent, calendar_agent],
)

# ✅ Guardrail to filter out non-calendar input
class HomeworkOutput(BaseModel):
    is_homework: bool
    reasoning: str

guardrail_agent = Agent(
    name="Guardrail",
    instructions="Tell if the user's message is about homework",
    output_type=HomeworkOutput,
)

async def homework_guardrail(ctx, agent, input_data):
    result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
    parsed = result.final_output_as(HomeworkOutput)
    return GuardrailFunctionOutput(
        output_info=parsed,
        tripwire_triggered=not parsed.is_homework
    )

# Add guardrail to triage agent
triage_agent.input_guardrails = [InputGuardrail(guardrail_function=homework_guardrail)]

# 🚀 Main execution
async def main():
    context = UserContext(uid="123", name="Betteronics", is_pro_user=True)

    print("🧠 Running Haiku Agent with tool:")
    result = await Runner.run(haiku_agent, "What's the weather in Paris?")
    print(result.final_output)

    print("\n📅 Running Calendar Extraction Agent:")
    cal_result = await Runner.run(calendar_agent, "Book a call with Alice on June 15 at 3PM", context=context)
    print(cal_result.final_output)

    print("\n🎯 Running Triage Agent with dynamic instructions + handoffs + guardrail:")
    result = await Runner.run(triage_agent, "I'd like to book a service", context=context)
    print(result.final_output)

    print("\n🚫 Running Triage Agent with non-homework input (guardrail triggers):")
    result = await Runner.run(triage_agent, "Tell me about the meaning of life", context=context)
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
