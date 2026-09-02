from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from state.interviewstate import InterviewState
from langchain_core.messages import SystemMessage
from prompts.behavioral_prompt import BehavioralPrompt
from services.llm_factory import get_llm
import os


load_dotenv()


class BehavioralEvaluatorNode:

    def __init__(self):

        self.llm = get_llm()

    def __call__(self, state: InterviewState) -> dict:
        """
        Evaluate the candidate's completed behavioral interview.

        The conversation is retrieved from LangGraph's
        checkpointed messages state.
        """

        interview_plan = state.interview_plan
        behavioral_plan = interview_plan.behavioral

        # conversation history is maintained by LangGraph's checkpointer through the messages state
        messages = state.get("messages", [])

        if not messages:
            raise ValueError(
                "No behavioral interview messages found in state."
            )

        prompt = BehavioralPrompt.get_behavior_evaluation_prompt(behavioral_plan)

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
            "behavioral_evaluation": response.content
        }