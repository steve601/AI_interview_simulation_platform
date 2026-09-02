import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.analysis import router as analysis_router
from api.routes.interview import router as interview_router
from api.routes.feedback import router as feedback_router


app = FastAPI(
    title="PromptHire API",
    description="AI-powered interview simulation platform",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------
# Dev frontend origin(s). Override via CORS_ORIGINS env var
# to allow a deployed frontend. We do NOT allow "*" when
# credentials are involved.
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

env_origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "").split(",")
    if o.strip()
]

allowed_origins = env_origins or default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(
    analysis_router,
    prefix="/api/analysis",
    tags=["Analysis"],
)

app.include_router(
    interview_router,
    prefix="/api/interview",
    tags=["Interview"],
)

app.include_router(
    feedback_router,
    prefix="/api/feedback",
    tags=["Feedback"],
)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "PromptHire API is running",
        "status": "healthy",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
