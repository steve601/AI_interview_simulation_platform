from prompts.jd_prompt import JDPrompt
from models.jd_model import JDModel
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class JDAnalyzerNode:
    """
    This node analyzes the user's job description (JD) using a language model (LLM) and a predefined prompt template.
    It takes the JD text from the interview state, processes it through the LLM with the JDPrompt, and updates the interview state with the analysis results.
    """
    def __init__(self):
        self.llm = get_llm().with_structured_output(JDModel)

    def __call__(self, state: InterviewState):

        job_description = state["jd_text"]

        # prompt initialization
        prompt = JDPrompt.get_prompt()

        # creating chain of prompt and llm
        chain = prompt | self.llm

        # invoking chain with jd_text as value, since it was in the prompt
        result = chain.invoke({"jd_text": job_description})

        # updating state's jd_analysis
        return {
            "jd_analysis": result
        }