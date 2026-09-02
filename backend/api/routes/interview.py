from typing import AsyncGenerator
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from api.dependancies import get_interview_graph
from langgraph.types import Command

router = APIRouter()


class StartInterviewRequest(BaseModel):
    thread_id: str


class AnswerRequest(BaseModel):
    thread_id: str
    answer: str


class NextRoundRequest(BaseModel):
    thread_id: str


INTERVIEWER_NODES = {
    "behavioral_interviewer",
    "technical_interviewer",
    "system_design_interviewer",
}


def format_sse(event: str, data: str) -> str:
    return (
        f"event: {event}\n"
        f"data: {data}\n\n"
    )


# start interview
@router.post("/start")
async def start_interview(
    request: StartInterviewRequest,
    graph=Depends(get_interview_graph),
):
    """
    Start the behavioral interview and stream the
    interviewer's response token-by-token.
    """

    config = {"configurable": {"thread_id": request.thread_id}}

    async def generate() -> AsyncGenerator[str, None]:
        try:
            # Resume from the analysis gate interrupt.
            stream = graph.astream(
                Command(resume=True),
                config=config,
                stream_mode="messages",
            )

            async for message_chunk, metadata in stream:
                node_name = metadata.get("langgraph_node")
                if node_name not in INTERVIEWER_NODES:
                    continue
                if not message_chunk.content:
                    continue
                yield format_sse("token", str(message_chunk.content))

            yield format_sse("done", "true")

        except Exception:
            yield format_sse(
                "error",
                "Interview could not be started. Please try again.",
            )

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
# submit answer
@router.post("/answer")
async def submit_answer(
    request: AnswerRequest,
    graph=Depends(get_interview_graph),
):
    """
    Submit the candidate's answer and stream the next
    interviewer response in real time.
    """
    config = {"configurable": {"thread_id": request.thread_id}}

    async def generate() -> AsyncGenerator[str, None]:
        try:
            # Resume the answer-gate interrupt with the answer text.
            # The answer gate node appends it as a HumanMessage so the
            # LangGraph state / evaluators can consume it.
            stream = graph.astream(
                Command(resume=request.answer),
                config=config,
                stream_mode="messages",
            )
            async for message_chunk, metadata in stream:
                node_name = metadata.get("langgraph_node")
                if node_name not in INTERVIEWER_NODES:
                    continue
                if not message_chunk.content:
                    continue
                yield format_sse("token", str(message_chunk.content))

            yield format_sse("done", "true")

        except Exception:
            yield format_sse(
                "error",
                "Your answer could not be processed. Please try again.",
            )

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
# next round
@router.post("/next-round")
async def next_round(
    request: NextRoundRequest,
    graph=Depends(get_interview_graph),
):
    """
    Move to the next interview round and stream its
    first interviewer question.
    """
    config = {"configurable": {"thread_id": request.thread_id}}

    async def generate() -> AsyncGenerator[str, None]:
        try:
            # Resume the round-transition interrupt so the graph
            # advances into the next round's first interviewer.
            stream = graph.astream(
                Command(resume=True),
                config=config,
                stream_mode="messages",
            )
            async for message_chunk, metadata in stream:
                node_name = metadata.get("langgraph_node")
                if node_name not in INTERVIEWER_NODES:
                    continue
                if not message_chunk.content:
                    continue
                yield format_sse("token", str(message_chunk.content))

            yield format_sse("done", "true")

        except Exception:
            yield format_sse(
                "error",
                "Could not move to the next round. Please try again.",
            )

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )