from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from langchain_core.messages import AIMessage
from langgraph.types import Command
from api.dependancies import get_interview_graph

router = APIRouter()

# we define Pydantic models for the request bodies of the API endpoints. These models ensure that the incoming requests have the expected structure and data types.
# This defines what /start expects.
class StartInterviewRequest(BaseModel):
    thread_id: str

# used when the candidate submits an answer.
class AnswerRequest(BaseModel):
    thread_id: str
    answer: str

# used when the candidate clicks something like:
class NextRoundRequest(BaseModel):
    thread_id: str

# gets latest AI generated question from the graph result. The graph may return multiple messages, but we want the most recent AIMessage, which is the latest question for the candidate.
def get_latest_question(result: dict):
    messages = result.get("messages", [])

    for message in reversed(messages):
        if isinstance(message, AIMessage):
            return message.content

    return None

# FastAPI automatically does two things; it parses the request body into the Pydantic model, and it validates the data. If the request body doesn't match the model, FastAPI will return a 422 Unprocessable Entity error.
# It execute get_interview_graph() to get the graph instance, and it passes that instance to the endpoint function as the graph parameter.
@router.post("/start")
async def start_interview(
    request: StartInterviewRequest,
    graph=Depends(get_interview_graph),
):
    config = {
        "configurable": {
            "thread_id": request.thread_id
        }
    }

    try:
        print(f"STARTING INTERVIEW: {request.thread_id}")

        result = await graph.ainvoke(
            Command(resume=True),
            config=config,
        )

        question = get_latest_question(result)

        print("INTERVIEW STARTED")
        print("QUESTION GENERATED")

        return {
            "status": "success",
            "thread_id": request.thread_id,
            "question": question,
        }

    except Exception as exc:
        print(f"START INTERVIEW ERROR: {exc}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to start interview: {str(exc)}",
        )


@router.post("/answer")
async def submit_answer(
    request: AnswerRequest,
    graph=Depends(get_interview_graph),
):
    config = {
        "configurable": {
            "thread_id": request.thread_id
        }
    }

    if not request.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty.",
        )

    try:
        print(f"SUBMITTING ANSWER: {request.thread_id}")

        result = await graph.ainvoke(
            Command(resume=request.answer),
            config=config,
        )

        question = get_latest_question(result)

        print("ANSWER PROCESSED")
        print("NEXT QUESTION GENERATED")

        return {
            "status": "success",
            "thread_id": request.thread_id,
            "question": question,
        }

    except Exception as exc:
        print(f"SUBMIT ANSWER ERROR: {exc}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit answer: {str(exc)}",
        )


@router.post("/next-round")
async def next_round(
    request: NextRoundRequest,
    graph=Depends(get_interview_graph),
):
    config = {
        "configurable": {
            "thread_id": request.thread_id
        }
    }

    try:
        print(f"MOVING TO NEXT ROUND: {request.thread_id}")

        result = await graph.ainvoke(
            Command(resume=True),
            config=config,
        )

        question = get_latest_question(result)

        print("NEXT ROUND STARTED")

        return {
            "status": "success",
            "thread_id": request.thread_id,
            "question": question,
        }

    except Exception as exc:
        print(f"NEXT ROUND ERROR: {exc}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to move to next round: {str(exc)}",
        )