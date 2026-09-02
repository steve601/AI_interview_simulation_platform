from prompts.cv_prompt import CVPrompt
from state.interviewstate import InterviewState
from models.cv_model import CVModel
from services.llm_factory import get_llm

# This's the second node of our state, it analyzes user's resume
class CVAnalyzerNode:

    def __init__(self):
        self.llm = get_llm(4000).with_structured_output(CVModel)

    def __call__(self, state: InterviewState):
        """
        Analyzes the user's resume using a language model."""
        cv_text = state["cv_text"]

        # prompt initialization
        prompt = CVPrompt.get_prompt() 

        # creating chain of prompt and llm
        chain = prompt | self.llm

        # invoking chain with cv_text as value, since it was in the prompt
        result = chain.invoke({"cv_text": cv_text})

        # updating state's cv_analysis
        return {
            "cv_analysis": result
        }
