from langgraph.types import interrupt
from state.interviewstate import InterviewState


class AnalysisGateNode:
    """
    Pauses the graph after the interview planner has generated
    the complete interview plan (CV analysis, JD analysis,
    gap analysis, and the round structure).

    The frontend calls `/generate-plan` which invokes the graph.
    After the planner completes, this node interrupts and returns
    the analysis results to the frontend. When the candidate clicks
    "Start Interview", the same graph instance is resumed with the
    same thread_id through `/interview/start`.
    """

    def __call__(self, state: InterviewState) -> dict:

        interrupt({
            "type": "analysis_complete",
            "message": (
                "The interview plan has been generated. "
                "Start the interview when ready."
            ),
        })

        # The candidate has confirmed they want to begin.
        # The graph continues to the first interviewer node.
        return {
            "current_round": "behavioral",
            "current_question_index": 0,
        }