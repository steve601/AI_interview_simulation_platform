from prompts.gapAnalyzer_prompt import GapAnalyzerPrompt
from models.gapAnalyzer_model import GapAnalyzerModel
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class GapAnalyzerNode:
    """
    This node analyzes the gap between the user's resume (CV) and the job description (JD) using a language model (LLM) and a predefined prompt template.
    It takes the CV text and JD text from the interview state, processes them through the LLM with the GapAnalyzerPrompt, and updates the interview state with the gap analysis results."""
    def __init__(self):
        self.llm = get_llm().with_structured_output(GapAnalyzerModel)

    def __call__(self, state: InterviewState):
    
        cv_text = state["cv_text"]
        jd_text = state["jd_text"]

        prompt = GapAnalyzerPrompt.get_prompt()

        chain = prompt | self.llm

        result = chain.invoke({"cv_text": cv_text, "jd_text": jd_text})

        return {
            "gap_analysis": result
        }
        