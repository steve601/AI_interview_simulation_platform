from prompts.planner_prompt import InterviewPlannerPrompt
from models.planner_model import InterviewPlanModel
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class InterviewPlannerNode:
    """
    This node generates an interview plan based on the analysis of the user's resume (CV), job description (JD), and gap analysis using a language model (LLM) and a predefined prompt template.
    It takes the CV analysis, JD analysis, and gap analysis from the interview state, processes them through the LLM with the InterviewPlannerPrompt, and updates the interview state with the generated interview plan."""
    def __init__(self):
        self.llm = get_llm().with_structured_output(InterviewPlanModel)

    def __call__(self, state: InterviewState):

        cv_analysis = state["cv_analysis"]
        jd_analysis = state["jd_analysis"]
        gap_analysis = state["gap_analysis"]

        # Convert Pydantic objects into clean JSON
        cv_json = cv_analysis.model_dump_json(
            exclude_none=True
        )

        jd_json = jd_analysis.model_dump_json(
            exclude_none=True
        )

        gap_json = gap_analysis.model_dump_json(
            exclude_none=True
        )

        prompt = InterviewPlannerPrompt.get_prompt()

        chain = prompt | self.llm

        result = chain.invoke({"cv_analysis": cv_json, "jd_analysis": jd_json, "gap_analysis": gap_json})

        return {
            "interview_plan": result,
            "current_round": "behavioral",
            "current_question_index": 0
        }