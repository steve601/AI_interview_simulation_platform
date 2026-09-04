from typing import List
from pydantic import BaseModel, Field

# Model representation for Interview plan
class BehavioralModel(BaseModel):
    number_of_questions: int = Field(default=8,description="Number of behavioral questions")
    topics: List[str] = Field(...,description="Topics to cover")
    question_objectives: List[str] = Field(...,description="Objective for each question")
    evaluation_criteria: List[str] = Field(...,description="Criteria for evaluating answers")
    follow_up_strategy: str = Field(...,description="How to follow up based on candidate responses")
    strong_answer_indicators: List[str] = Field(...,description="Characteristics of a strong answer")
    weak_answer_indicators: List[str] = Field(...,description="Characteristics of a weak answer")

class TechnicalModel(BaseModel):
    number_of_questions: int = Field(default=10,description="Number of behavioral questions")
    topics: List[str] = Field(...,description="Topics to cover")
    question_objectives: List[str] = Field(...,description="Objective for each question")
    evaluation_criteria: List[str] = Field(...,description="Criteria for evaluating answers")
    follow_up_strategy: str = Field(...,description="How to follow up based on candidate responses")
    strong_answer_indicators: List[str] = Field(...,description="Characteristics of a strong answer")
    weak_answer_indicators: List[str] = Field(...,description="Characteristics of a weak answer")

class SystemDesignModel(BaseModel):
    number_of_questions: int = Field(default=5,description="Number of behavioral questions")
    topics: List[str] = Field(...,description="Topics to cover")
    question_objectives: List[str] = Field(...,description="Objective for each question")
    evaluation_criteria: List[str] = Field(...,description="Criteria for evaluating answers")
    follow_up_strategy: str = Field(...,description="How to follow up based on candidate responses")
    strong_answer_indicators: List[str] = Field(...,description="Characteristics of a strong answer")
    weak_answer_indicators: List[str] = Field(...,description="Characteristics of a weak answer")


# Main model
class InterviewPlanModel(BaseModel):
    behavioral: BehavioralModel = Field(...,description="Behavioral interview plan")
    technical: TechnicalModel = Field(...,description="Technical interview plan")
    system_design: SystemDesignModel = Field(...,description="System design interview plan")
    candidate_strengths_to_validate: List[str] = Field(...,description="Candidate strengths that should be validated")
    candidate_weaknesses_to_investigate: List[str] = Field(...,description="Candidate weaknesses or gaps to investigate")
    cv_claims_to_verify: List[str] = Field(...,description="CV claims that should be verified")
    priority_job_requirements: List[str] = Field(...,description="Job requirements requiring special interview attention")

