from langchain_core.messages import SystemMessage
from prompts.technical_prompt import TechnicalPrompt
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class TechnicalEvaluatorNode:
    """
    This node evaluates the user's responses in a technical interview based on the interview plan generated in the previous node.
    It takes the interview plan and the current state of the interview from the interview state, processes them through the LLM with the TechnicalPrompt, and updates the interview state with the evaluation results."""
    def __init__(self):

        self.llm = get_llm()

    def __call__(self, state: InterviewState) -> dict:

        interview_plan = state["interview_plan"]
        technical_plan = interview_plan.technical

        messages = state.get("messages", [])

        if not messages:
            raise ValueError(
                "No technical interview messages found in state."
            )

        prompt = TechnicalPrompt.get_technical_evaluation_prompt(technical_plan)
        system_message = SystemMessage(content = prompt)

        evaluation_messages = [system_message,*messages]
        response = self.llm.invoke(evaluation_messages)

        return {
            "technical_evaluation": response.content
        }