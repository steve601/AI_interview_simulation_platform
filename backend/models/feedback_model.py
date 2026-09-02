from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field

# Pydantic models for feedback data representation; LLM must produce output matching this
class ScoreBand(str, Enum):
    EXCELLENT = "Excellent"
    GOOD = "Good"
    AVERAGE = "Average"
    BELOW_AVERAGE = "Below Average"

class ReadinessBand(str, Enum):
    STRONG_ALIGNMENT = "Strong alignment"
    GOOD_ALIGNMENT = "Good alignment"
    PARTIAL_ALIGNMENT = "Partial alignment"
    DEVELOPMENT_NEEDED = "Significant development needed"

class PriorityLevel(str, Enum):
    HIGH = "High Priority"
    MEDIUM = "Medium Priority"
    LOW = "Low Priority"

class ImprovementItem(BaseModel):
    area: str = Field(...,description="Specific area requiring improvement")
    evidence: str = Field(...,description="Evidence from the interview evaluations")
    why_it_matters: str = Field(...,description="Why this area matters for the target role")
    improvement_action: str = Field(...,description="Specific action the candidate should take")


class NextStep(BaseModel):
    priority: PriorityLevel = Field(...,description="Priority of the recommendation")
    recommendation: str = Field(...,description="Specific recommended learning or practice activity")


# Main model
class FeedbackModel(BaseModel):

    candidate_name: Optional[str] = Field(None,description="Candidate name if available in the evaluation data")
    target_role: Optional[str] = Field(None,description="Target role if available")
    organization: Optional[str] = Field(None,description="Organization if available")
    overall_score: Optional[float] = Field(None,ge=0,le=100,description="Overall interview score from 0 to 100")
    score_band: Optional[ScoreBand] = Field(None,description="Overall performance score band")
    behavioral_score: Optional[float] = Field(None,ge=0,le=100,description="Behavioral interview score")
    technical_score: Optional[float] = Field(None,ge=0,le=100,description="Technical interview score")
    system_design_score: Optional[float] = Field(None,ge=0,le=100,description="System design interview score")
    overall_performance: str = Field(...,description="Executive summary of overall interview performance")
    behavioral_performance: Optional[str] = Field(None,description="Summary of behavioral interview performance")
    technical_performance: Optional[str] = Field(None,description="Summary of technical interview performance")
    system_design_performance: Optional[str] = Field(None,description="Summary of system design performance")
    strengths: List[str] = Field(...,description="Strongest demonstrated capabilities")
    areas_for_improvement: List[ImprovementItem] = Field(...,description="Most important areas requiring improvement")
    role_readiness: ReadinessBand = Field(...,description="How well demonstrated performance aligns with the role")
    recommended_next_steps: List[NextStep] = Field(...,description="Prioritized learning and practice recommendations")
    final_feedback: str = Field(...,description="Concise personalized final feedback")