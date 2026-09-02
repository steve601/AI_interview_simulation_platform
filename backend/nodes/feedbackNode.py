from prompts.feedback_prompt import FeedbackPrompt
from models.feedback_model import FeedbackModel
from state.interviewstate import InterviewState
from services.llm_factory import get_llm


class FeedbackNode:

    def __init__(self):
        self.llm = get_llm().with_structured_output(
            FeedbackModel
        )

    def __call__(self, state: InterviewState) -> dict:

        behavioral_evaluation = state["behavioral_evaluation"]
        technical_evaluation = state["technical_evaluation"]
        system_design_evaluation = state["system_design_evaluation"]

        # Convert structured evaluation results to JSON
        behavioral_json = (
            behavioral_evaluation.model_dump_json(exclude_none=True)
            if hasattr(behavioral_evaluation, "model_dump_json")
            else str(behavioral_evaluation)
        )

        technical_json = (
            technical_evaluation.model_dump_json(exclude_none=True)
            if hasattr(technical_evaluation, "model_dump_json")
            else str(technical_evaluation)
        )

        system_design_json = (
            system_design_evaluation.model_dump_json(exclude_none=True)
            if hasattr(system_design_evaluation, "model_dump_json")
            else str(system_design_evaluation)
        )

        prompt = FeedbackPrompt.get_prompt()

        chain = prompt | self.llm

        result = chain.invoke({
            "behavioral_evaluation": behavioral_json,
            "technical_evaluation": technical_json,
            "system_design_evaluation": system_design_json
        })

        return {
            "feedback": result
        }