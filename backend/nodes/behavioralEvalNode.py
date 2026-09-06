from state.interviewstate import InterviewState
from langchain_core.messages import SystemMessage
from prompts.behavioral_prompt import BehavioralPrompt
from services.llm_factory import get_llm

class BehavioralEvaluatorNode:
    """
    This node evaluates the user's responses in a behavioral interview based on the interview plan generated in the previous node.
    It takes the interview plan and the current state of the interview from the interview state, processes them through the LLM with the BehavioralPrompt, and updates the interview state with the evaluation results."""
    def __init__(self):

        self.llm = get_llm()

    def __call__(self, state: InterviewState) -> dict:

        interview_plan = state["interview_plan"]
        behavioral_plan = interview_plan.behavioral

        # get the convo history, the messages consist of HumanMessage and AIMessage objects, which are used to represent the conversation between the user and the AI during the behavioral interview.
        messages = state.get("messages", [])

        if not messages:
            raise ValueError(
                "No behavioral interview messages found in state."
            )

        # prompt initialization for behavioral evaluation, using the behavioral plan to generate a system message that will guide the LLM in evaluating the user's responses.
        prompt = BehavioralPrompt.get_behavior_evaluation_prompt(behavioral_plan)
        system_message = SystemMessage(content = prompt)

        evaluation_messages = [system_message,*messages]
        response = self.llm.invoke(evaluation_messages)

        return {
            "behavioral_evaluation": response.content
        }