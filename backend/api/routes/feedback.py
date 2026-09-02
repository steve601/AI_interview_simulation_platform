from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from langgraph.graph.state import CompiledStateGraph
from api.dependancies import get_interview_graph


router = APIRouter()


class FeedbackRequest(BaseModel):
    thread_id: str


@router.get("/{thread_id}")
async def get_feedback(
    thread_id: str,
    graph: CompiledStateGraph = Depends(
        get_interview_graph
    ),
):
    """
    Retrieve the final PromptHire feedback
    and interview report.
    """

    try:

        config = {
            "configurable": {
                "thread_id": thread_id
            }
        }

        # Retrieve the persisted LangGraph state
        state = graph.get_state(config)

        values = state.values

        if not values:
            raise HTTPException(
                status_code=404,
                detail="Interview session not found."
            )

        return {
            "status": "success",
            "feedback": values.get(
                "feedback"
            ),
            "behavioral_evaluation": values.get(
                "behavioral_evaluation"
            ),
            "technical_evaluation": values.get(
                "technical_evaluation"
            ),
            "system_design_evaluation": values.get(
                "system_design_evaluation"
            ),
            "interview_completed": values.get(
                "interview_completed",
                False
            ),
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )