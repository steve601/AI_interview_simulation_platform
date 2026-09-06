import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from langgraph.graph.state import CompiledStateGraph
from api.dependancies import get_interview_graph
from services.file_reader import read_cv

router = APIRouter()

@router.post("/generate-plan")
async def generate_interview_plan(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...),
    thread_id: str = Form(""),
    graph: CompiledStateGraph = Depends(get_interview_graph),
):
    """
    Upload CV + Job Description and generate
    the PromptHire interview plan.

    The LangGraph graph runs through CV / JD / gap analysis
    and the interview planner, then pauses at the analysis
    gate waiting for the candidate to start the interview.
    """

    session_id = thread_id.strip() or f"ph_{uuid.uuid4().hex[:12]}"

    try:
        cv_text = read_cv(cv_file.file)

        if not cv_text.strip():
            raise HTTPException(
                status_code=400,
                detail="CV file is empty or could not be parsed."
            )

        if not job_description.strip():
            raise HTTPException(
                status_code=400,
                detail="Job description is empty."
            )

        # initial state of the graph
        initial_state = {
            "cv_text": cv_text,
            "jd_text": job_description,

            "current_round": "analysis",
            "current_question_index": 0,

            "interview_completed": False,

            "behavioral_completed": False,
            "technical_completed": False,
            "system_design_completed": False,
        }

        # invoking the graph - stops at the analysis gate interrupt
        config = {
            "configurable": {
                "thread_id": session_id
            }
        }

        result = graph.invoke(
            initial_state,
            config=config
        )

        return {
            "status": "success",
            "thread_id": session_id,
            "interview_plan": result.get(
                "interview_plan"
            ),
            "cv_analysis": result.get(
                "cv_analysis"
            ),
            "jd_analysis": result.get(
                "jd_analysis"
            ),
            "gap_analysis": result.get(
                "gap_analysis"
            ),
        }

    except HTTPException:
        raise

    except Exception as e:
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )