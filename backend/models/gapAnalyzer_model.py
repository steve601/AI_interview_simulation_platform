from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

# Pydantic models for gap analysis data representation
class ScoreBand(str, Enum):
    MATCHED = "Matched"
    PARTIALLY_MATCHED = "Partially Matched"
    NOT_MATCHED = "Not Matched"


class GapItem(BaseModel):
    category: str = Field(...,description="Gap category: Skills, Experience, or Qualifications")
    item: str = Field(...,description="Specific skill, experience, or qualification being analyzed")
    candidate_evidence: Optional[str] = Field(None,description="Evidence from the CV supporting the candidate's match")
    job_requirement: Optional[str] = Field(None,description="Corresponding requirement from the job description")
    score_band: ScoreBand = Field(...,description="Match level between candidate evidence and job requirement")
    explanation: Optional[str] = Field(None,description="Explanation of the match or gap")

# Main model for gap analysis output
class GapAnalyzerModel(BaseModel):
    gaps: List[GapItem] = Field(...,description="List of identified gaps and matches")
    overall_summary: Optional[str] = Field(None,description="Concise summary of the candidate's major gaps")
    priority_gaps: List[str] = Field(default_factory=list,description="Most important gaps to address during the interview")

