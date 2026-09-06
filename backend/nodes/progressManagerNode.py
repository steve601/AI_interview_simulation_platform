from typing import Any, Dict
from state.interviewstate import InterviewState

class ProgressManagerNode:
    """
    Manages progress across the PromptHire interview rounds.

    It determines whether the current interview round has been
    completed based on the number of questions defined in the
    InterviewPlanModel and only advances to the next round when
    the configured number of questions has been asked.
    """

    def __call__(self, state: InterviewState) -> Dict:

        current_round = state.get("current_round")
        current_question_index = state.get("current_question_index",0)

        interview_plan = state.get("interview_plan")
        if interview_plan is None:
            raise ValueError(
                "Interview plan is required for progress management."
            )

        if current_round == "behavioral":
            total_questions = (interview_plan.behavioral.number_of_questions)

        elif current_round == "technical":
            total_questions = (interview_plan.technical.number_of_questions)

        elif current_round == "system_design":
            total_questions = (interview_plan.system_design.number_of_questions)

        else:
            return {
                "current_round": current_round
            }

        # determine if the current round has been completed
        round_completed = (current_question_index >= total_questions)

        if current_round == "behavioral":
            return {"behavioral_completed": round_completed}

        elif current_round == "technical":
            return {"technical_completed": round_completed}

        elif current_round == "system_design":
            return {"system_design_completed": round_completed}

        return {}