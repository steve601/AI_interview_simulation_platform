from typing import Any, Dict


class Routing:

    @staticmethod
    def route_after_progress(
        state: Dict[str, Any]
    ) -> str:

        current_round = state.get(
            "current_round"
        )

        current_question_index = state.get(
            "current_question_index",
            0
        )

        interview_plan = state.get(
            "interview_plan"
        )

        if current_round == "behavioral":

            total_questions = (
                interview_plan.behavioral.number_of_questions
            )

            if current_question_index >= total_questions:
                return "behavioral_evaluator"

            return "behavioral_interviewer"

        if current_round == "technical":

            total_questions = (
                interview_plan.technical.number_of_questions
            )

            if current_question_index >= total_questions:
                return "technical_evaluator"

            return "technical_interviewer"

        if current_round == "system_design":

            total_questions = (
                interview_plan.system_design.number_of_questions
            )

            if current_question_index >= total_questions:
                return "system_design_evaluator"

            return "system_design_interviewer"

        raise ValueError(
            f"Unknown interview round: {current_round}"
        )

    @staticmethod
    def route_after_round_transition(
        state: Dict[str, Any]
    ) -> str:

        current_round = state.get(
            "current_round"
        )

        # The RoundTransitionNode already advanced `current_round`
        # to the next round (or "completed"). Route to that round.
        if current_round == "technical":

            return "technical"

        if current_round == "system_design":

            return "system_design"

        if current_round == "completed":

            return "completed"

        raise ValueError(
            f"Unknown interview round: {current_round}"
        )