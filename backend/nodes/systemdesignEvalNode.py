from langchain_core.messages import SystemMessage
from prompts.systemdesign_prompt import SystemDesignPrompt
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class SystemDesignEvaluatorNode:
    """
    This node evaluates the user's responses in a system design interview based on the interview plan generated in the previous node.
    It takes the interview plan and the current state of the interview from the interview state, processes them through the LLM with the SystemDesignPrompt, and updates the interview state with the evaluation results."""
    def __init__(self):

        self.llm = get_llm()
        
    def __call__(self, state: InterviewState) -> dict:
       
        interview_plan = state["interview_plan"]
        system_design_plan = interview_plan.system_design

        messages = state.get("messages", [])

        if not messages:
            raise ValueError(
                "No system design interview messages found in state."
            )

        prompt = SystemDesignPrompt.get_system_design_evaluation_prompt(system_design_plan)
        system_message = SystemMessage(content = prompt)

        evaluation_messages = [system_message,*messages]
        response = self.llm.invoke(evaluation_messages)

        return {
            "system_design_evaluation": response.content
        }