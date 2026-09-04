from prompts.jd_prompt import JDPrompt
from models.jd_model import JDModel
from state.interviewstate import InterviewState
from services.llm_factory import get_llm

class JDAnalyzerNode:

    def __init__(self):
        self.llm = get_llm(4000).with_structured_output(JDModel)

    def __call__(self, state: InterviewState):
        """
        Analyzes the job description using a language model.
        """

        job_description = state["jd_text"]

        prompt = JDPrompt.get_prompt()

        chain = prompt | self.llm

        result = chain.invoke({"jd_text": job_description})

        return {
            "jd_analysis": result
        }