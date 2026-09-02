from typing import Optional, List, Dict
from pydantic import BaseModel, Field

# Pydantic models for CV data representation; we expect the output to match this
class Education(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    graduation_year: Optional[str] = None
    relevant_coursework: Optional[List[str]] = None

class WorkExperience(BaseModel):
    job_title: Optional[str] = None
    organization: Optional[str] = None
    duration: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    quantifiable_results: Optional[List[str]] = None

class Project(BaseModel):
    name: Optional[str] = None
    problem_solved: Optional[str] = None
    technologies_used: Optional[List[str]] = None
    contribution: Optional[str] = None
    results: Optional[str] = None
    measurable_impact: Optional[str] = None

class Certification(BaseModel):
    certification: Optional[str] = None
    issuing_organization: Optional[str] = None
    date: Optional[str] = None

class InterviewEvidence(BaseModel):
    strong_areas: Optional[List[str]] = None
    topics_to_question: Optional[List[str]] = None
    technical_topics: Optional[List[str]] = None
    projects_for_deep_dive: Optional[List[str]] = None
    behavioral_evidence: Optional[List[str]] = None
    claims_to_verify: Optional[List[str]] = None

# The main model(output presentation)
class CVModel(BaseModel):

    cv_id: str
    candidate_name: str

    professional_level: Optional[str] = None
    years_of_experience: Optional[int] = None
    career_summary: Optional[str] = None
    education: Optional[List[Education]] = None
    work_experience: Optional[List[WorkExperience]] = None
    technical_skills: Optional[Dict[str, List[str]]] = None
    projects: Optional[List[Project]] = None
    certifications: Optional[List[Certification]] = None
    achievements: Optional[List[str]] = None
    interview_relevant_evidence: Optional[InterviewEvidence] = None
    missing_or_unclear_information: Optional[List[str]] = None
    interview_question_seeds: Optional[List[str]] = None