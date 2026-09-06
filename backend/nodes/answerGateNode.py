from langgraph.types import interrupt
from langchain_core.messages import HumanMessage
from state.interviewstate import InterviewState


class AnswerGateNode:
    """
    Pauses the graph after each interviewer question until the
    candidate submits an answer via the `/interview/answer` endpoint.

    When resumed through LangGraph's `Command(resume=answer)`, the
    candidate's answer is returned by `interrupt` and added to the
    conversation history as a HumanMessage so the interview graph
    (interviewers, progress manager, evaluators) can consume it.
    """

    def __call__(self, state: InterviewState) -> dict:

        # pause the graph execution and send an interrupt message to the user
        user_answer = interrupt({
            "type": "candidate_answer_required",
            "message": (
                "Please provide your answer to continue "
                "with the interview."
            ),
        })

        # checks whether the user_answer is a non-empty string. If it is, it returns a dictionary containing the user's answer wrapped in a HumanMessage object. If the user_answer is not a valid string (e.g., it's empty or None), it returns an empty dictionary.
        if isinstance(user_answer, str) and user_answer.strip():

            return {
                "messages": [
                    HumanMessage(
                        content=user_answer
                    )
                ]
            }

        return {}