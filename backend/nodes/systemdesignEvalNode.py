from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from prompts.systemdesign_prompt import SystemDesignPrompt
from state.interviewstate import InterviewState
from dotenv import load_dotenv
from services.llm_factory import get_llm
import os

load_dotenv()

class SystemDesignEvaluatorNode:

    def __init__(self):

        self.llm = get_llm()
        
    def __call__(self, state: InterviewState) -> dict:
        """
        Evaluate the candidate's completed system design interview.

        The conversation is retrieved from LangGraph's
        checkpointed messages state.
        """

        interview_plan = state.interview_plan
        system_design_plan = interview_plan.system_design

        messages = state.get("messages", [])

        if not messages:
            raise ValueError(
                "No system design interview messages found in state."
            )

        prompt = SystemDesignPrompt.get_system_design_evaluation_prompt(system_design_plan)

        system_message = SystemMessage(
            content = prompt
        )

        evaluation_messages = [
            system_message,
            *messages
        ]

        response = self.llm.invoke(
            evaluation_messages
        )

        return {
            "system_design_evaluation": response.content
        }