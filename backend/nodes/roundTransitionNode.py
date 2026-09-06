from langgraph.types import interrupt
from state.interviewstate import InterviewState

class RoundTransitionNode:
    """
    This node handles the transition between different rounds of the interview process.
    It checks the current round in the interview state and updates it to the next round, resetting the current question index and setting the next_round_requested flag to False. It also sends an interrupt message to notify the user that they have completed the current round and can proceed to the next round."""
    def __call__(self, state: InterviewState):
        current_round = state.get("current_round")

        # pause the graph execution and send an interrupt message to the user
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