from langchain_core.messages import SystemMessage, AIMessage
from prompts.technical_prompt import TechnicalPrompt
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class TechnicalInterviewNode:
    """
    This node conducts a technical interview based on the interview plan generated in the previous node.
    It takes the interview plan and the current state of the interview from the interview state, processes them through the LLM with the TechnicalPrompt, and updates the interview state with the interview messages and the current question index."""
    def __init__(self):
        self.llm = get_llm()

    def __call__(self, state: InterviewState) -> dict:

        interview_plan = state["interview_plan"]
        technical_plan = interview_plan.technical

        messages = state.get("messages", [])
        question_index = state.get("current_question_index",0)

        prompt = TechnicalPrompt.get_technical_interview_prompt(technical_plan)
        technical_system_message = SystemMessage(content=prompt)

        llm_messages = [technical_system_message,*messages]
        response = self.llm.invoke(llm_messages)

        return {
            "messages": [
                AIMessage(
                    content=response.content
                )
            ],
            "current_question_index": question_index + 1
        }