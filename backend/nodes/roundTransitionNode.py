from langgraph.types import interrupt
from state.interviewstate import InterviewState

class RoundTransitionNode:

    def __call__(self, state: InterviewState):
        """
        Manages transitions between different stages of a mock interview.
        It acts as a human-in-the-loop checkpoint to pause execution and reset state 
        counters between interview rounds.
        """
        current_round = state.get(
            "current_round"
        )

        interrupt({
            "type": "round_completed",
            "round": current_round,
            "message": (
                f"You have completed the "
                f"{current_round} round. "
                "Click Next to continue."
            )
        })

        if current_round == "behavioral":

            return {
                "current_round": "technical",
                "current_question_index": 0,
                "next_round_requested": False,
            }

        if current_round == "technical":

            return {
                "current_round": "system_design",
                "current_question_index": 0,
                "next_round_requested": False,
            }

        if current_round == "system_design":

            return {
                "current_round": "completed",
                "current_question_index": 0,
                "interview_completed": True,
                "next_round_requested": False,
            }

        return {}