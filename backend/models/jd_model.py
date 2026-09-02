from typing import Optional, List
from pydantic import BaseModel, Field

# Pydantic repreentation for Job description
class JDModel(BaseModel):
    jd_id: str = Field(description="Unique identifier for the job description")
    job_title: str = Field(...,description="Title of the job position")
    company_name: Optional[str] = Field(None,description="Company offering the position")
    seniority: Optional[str] = Field(None,description="Seniority level explicitly stated in the JD")
    department: Optional[str] = Field(None,description="Department or domain")
    employment_type: Optional[str] = Field(None,description="Employment type")
    responsibilities: Optional[List[str]] = Field(None,description="Key responsibilities explicitly stated in the JD")
    required_technical_skills: Optional[List[str]] = Field(None,description="Required technical skills")
    preferred_technical_skills: Optional[List[str]] = Field(None,description="Preferred technical skills")
    tools_and_technologies: Optional[List[str]] = Field(None,description="Tools and technologies mentioned")
    domain_knowledge: Optional[List[str]] = Field(None,description="Required or preferred domain knowledge")
    behavioral_requirements: Optional[List[str]] = Field(None,description="Behavioral or soft-skill requirements")
    education_requirements: Optional[List[str]] = Field(None,description="Educational requirements")
    experience_requirements: Optional[List[str]] = Field(None,description="Experience requirements")
    interview_priorities: Optional[List[str]] = Field(None,description="Areas that should receive the most interview attention")
    important_requirements: Optional[List[str]] = Field(None,description="Requirements that should be explicitly verified")