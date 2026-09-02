from langchain_core.messages import SystemMessage, AIMessage
from prompts.technical_prompt import TechnicalPrompt
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class TechnicalInterviewNode:

    def __init__(self):

        self.llm = get_llm()
    
    def __call__(self, state: InterviewState) -> dict:
        """
        Conduct the technical interview using the LangGraph state.

        The conversation history is maintained by LangGraph's
        checkpointer through the messages state.
        """

        interview_plan = state.interview_plan
        technical_plan = interview_plan.technical

        messages = state.get("messages", [])

        question_index = state.get(
            "current_question_index",
            0
        )

        prompt = TechnicalPrompt.get_technical_interview_prompt(technical_plan)

        technical_system_message = SystemMessage(
            content = prompt
        )


        llm_messages = [
            technical_system_message,
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