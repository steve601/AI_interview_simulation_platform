from typing import Dict
from state.interviewstate import InterviewState

# starting point of our graph
def start_node(state: InterviewState) -> Dict:
    """
    Initialize PromptHire interview state.

    Only initializes fields that are not already present.
    """

    return {
        "current_round": state.get("current_round", "analysis"),
        "current_question_index": state.get("current_question_index", 0),
        "interview_completed": state.get("interview_completed", False),

        "cv_analysis": state.get("cv_analysis"),
        "jd_analysis": state.get("jd_analysis"),
        "gap_analysis": state.get("gap_analysis"),

        "interview_plan": state.get("interview_plan"),

        "behavioral_evaluation": state.get("behavioral_evaluation"),

        "technical_evaluation": state.get("technical_evaluation"),

        "system_design_evaluation": state.get("system_design_evaluation"),

        "feedback": state.get("feedback"),
        "report": state.get("report"),

        "behavioral_completed": state.get("behavioral_completed", False),
        "technical_completed": state.get("technical_completed", False),
        "system_design_completed": state.get("system_design_completed", False),
    }