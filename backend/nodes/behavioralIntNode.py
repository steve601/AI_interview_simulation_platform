from langchain_core.messages import SystemMessage, AIMessage
from prompts.behavioral_prompt import BehavioralPrompt
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class BehavioralInterviewNode:
    """
    This node conducts a behavioral interview based on the interview plan generated in the previous node.
    It takes the interview plan and the current state of the interview from the interview state, processes them through the LLM with the BehavioralPrompt, and updates the interview state with the interview messages and the current question index."""
    def __init__(self):
        self.llm = get_llm()

    def __call__(self, state: InterviewState) -> dict:

        interview_plan = state["interview_plan"]
        behavioral_plan = interview_plan.behavioral

        # get the current messages and question index from the state, defaulting to an empty list and 0 if not present
        messages = state.get("messages", [])
        question_index = state.get("current_question_index",0)

        # prompt building using the behavioral plan and convert prompt to a system message
        prompt = BehavioralPrompt.get_behavior_interview_prompt(behavioral_plan)
        behavioral_system_message = SystemMessage(content=prompt)

        # combines system prompt and conversation messages, then invokes the LLM to generate a response
        llm_messages = [behavioral_system_message,*messages] # *messages means unpack all messages from the list.
        response = self.llm.invoke(llm_messages)

        # updating the messages list with the new AI response
        return {
            "messages": [
                AIMessage(
                    content=response.content
                )
            ],
            "current_question_index": question_index + 1
        }