from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from prompts.technical_prompt import TechnicalPrompt
from state.interviewstate import InterviewState
from dotenv import load_dotenv
from services.llm_factory import get_llm
import os

load_dotenv()

class TechnicalEvaluatorNode:

    def __init__(self):

        self.llm = get_llm()

    def __call__(self, state: InterviewState) -> dict:
        """
        Evaluate the candidate's completed technical interview.

        The conversation is retrieved from LangGraph's
        checkpointed messages state.
        """

        interview_plan = state.interview_plan
        technical_plan = interview_plan.technical

        # conversation history is maintained by LangGraph's checkpointer through the messages state
        messages = state.get("messages", [])

        if not messages:
            raise ValueError(
                "No technical interview messages found in state."
            )

        prompt = TechnicalPrompt.get_technical_evaluation_prompt(technical_plan)

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
            "technical_evaluation": response.content
        }