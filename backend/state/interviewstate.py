from typing import Optional, Any
from langgraph.graph import MessagesState
from models.planner_model import InterviewPlanModel
from models.cv_model import CVModel
from models.jd_model import JDModel
from models.feedback_model import FeedbackModel
from models.gapAnalyzer_model import GapAnalyzerModel

# This is our main state object that will be used to store the state of the interview process, we're using langgraph's MessagesState as a base class to store the state of the interview process, and we're adding our own fields to it
class InterviewState(MessagesState):
    cv_text: Optional[str]
    jd_text: Optional[str]

    cv_analysis: Optional[CVModel]
    jd_analysis: Optional[JDModel]
    gap_analysis: Optional[GapAnalyzerModel]
    interview_plan: Optional[InterviewPlanModel]

    # Progress
    current_round: str
    current_question_index: int
    interview_completed: bool

    # Round completion
    behavioral_completed: bool
    technical_completed: bool
    system_design_completed: bool

    # Evaluations
    behavioral_evaluation: Optional[Any]
    technical_evaluation: Optional[Any]
    system_design_evaluation: Optional[Any]

    # Final results
    feedback: Optional[FeedbackModel]
    report: Optional[Any]