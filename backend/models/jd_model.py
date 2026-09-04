from typing import Optional, List
from pydantic import BaseModel, Field

# Pydantic repreentation for Job description
class JDModel(BaseModel):
    jd_id: str = Field(description="Unique identifier for the job description")
    job_title: str = Field(...,description="Title of the job position")
    job_summary: str = Field(...,description="Summary of the job description")