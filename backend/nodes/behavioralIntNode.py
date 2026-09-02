from langchain_core.messages import SystemMessage, AIMessage
from prompts.behavioral_prompt import BehavioralPrompt
from state.interviewstate import InterviewState
from services.llm_factory import get_llm


class BehavioralInterviewNode:

    def __init__(self):

        self.llm = get_llm()
    
    def __call__(self, state: InterviewState) -> dict:
        """
        Conduct the behavioral interview using the LangGraph state.

        The conversation history is maintained by LangGraph's
        checkpointer through the messages state.
        """

        interview_plan = state.interview_plan
        behavioral_plan = interview_plan.behavioral

        messages = state.get("messages", [])

        question_index = state.get(
            "current_question_index",
            0
        )

        prompt = BehavioralPrompt.get_behavior_interview_prompt(behavioral_plan)

        behavioral_system_message = SystemMessage(
            content = prompt
        )


        llm_messages = [
            behavioral_system_message,
            *messages
        ]


        response = self.llm.invoke(llm_messages)

        return {
            "messages": [
                AIMessage(
                    content=response.content
                )
            ],
            "current_question_index": question_index + 1
        }