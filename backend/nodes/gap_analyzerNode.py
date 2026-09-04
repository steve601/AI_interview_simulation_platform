from prompts.gapAnalyzer_prompt import GapAnalyzerPrompt
from models.gapAnalyzer_model import GapAnalyzerModel
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class GapAnalyzerNode:

    def __init__(self):
        self.llm = get_llm(4000).with_structured_output(
            GapAnalyzerModel
        )

    def __call__(self, state: InterviewState):
        """
        Analyzes the gap between the user's resume and the job description using a language model.
        """
        cv_text = state["cv_text"]
        jd_text = state["jd_text"]

        prompt = GapAnalyzerPrompt.get_prompt()

        chain = prompt | self.llm

        result = chain.invoke({"cv_text": cv_text, "jd_text": jd_text})

        return {
            "gap_analysis": result
        }
        