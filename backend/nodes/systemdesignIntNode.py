from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, AIMessage
from prompts.systemdesign_prompt import SystemDesignPrompt
from state.interviewstate import InterviewState
from dotenv import load_dotenv
from services.llm_factory import get_llm
import os

load_dotenv()

class SystemDesignInterviewNode:
    
    def __init__(self):

        self.llm = get_llm()
    
    def __call__(self, state: InterviewState) -> dict:
        """
        Conduct the system design interview using the LangGraph state.

        The conversation history is maintained by LangGraph's
        checkpointer through the messages state.
        """

        interview_plan = state.interview_plan
        system_design_plan = interview_plan.system_design

        messages = state.get("messages", [])

        question_index = state.get(
            "current_question_index",
            0
        )

        prompt = SystemDesignPrompt.get_system_design_interview_prompt(system_design_plan)

        system_design_system_message = SystemMessage(
            content = prompt
        )


        llm_messages = [
            system_design_system_message,
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