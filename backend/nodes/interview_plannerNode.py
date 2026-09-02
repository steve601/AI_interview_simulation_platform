from prompts.planner_prompt import InterviewPlannerPrompt
from models.planner_model import InterviewPlanModel
from state.interviewstate import InterviewState
from services.llm_factory import get_llm


class InterviewPlannerNode:

    def __init__(self):
        self.llm = get_llm(4000).with_structured_output(
            InterviewPlanModel
        )

    def __call__(self, state: InterviewState):
        """
        Generates an interview plan based on the CV analysis, job description analysis, and gap analysis using a language model.
        """
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