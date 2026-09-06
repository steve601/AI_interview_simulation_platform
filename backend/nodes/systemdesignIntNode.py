from langchain_core.messages import SystemMessage, AIMessage
from prompts.systemdesign_prompt import SystemDesignPrompt
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class SystemDesignInterviewNode:
    """
    This node conducts a system design interview based on the interview plan generated in the previous node.
    It takes the interview plan and the current state of the interview from the interview state, processes them through the LLM with the SystemDesignPrompt, and updates the interview state with the interview messages and the current question index."""
    def __init__(self):
        self.llm = get_llm()

    def __call__(self, state: InterviewState) -> dict:

        interview_plan = state["interview_plan"]
        system_design_plan = interview_plan.system_design

        messages = state.get("messages", [])
        question_index = state.get("current_question_index",0)

        prompt = SystemDesignPrompt.get_system_design_interview_prompt(system_design_plan)
        system_design_system_message = SystemMessage(content=prompt)

        llm_messages = [system_design_system_message,*messages]
        response = self.llm.invoke(llm_messages)

        return {
            "messages": [
                AIMessage(
                    content=response.content
                )
            ],
            "current_question_index": question_index + 1
        }