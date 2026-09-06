from prompts.cv_prompt import CVPrompt
from state.interviewstate import InterviewState
from models.cv_model import CVModel
from services.llm_factory import get_llm

# This's the second node of our state, it analyzes user's resume 
class CVAnalyzerNode:
    """
    This node analyzes the user's resume (CV) using a language model (LLM) and a predefined prompt template.
    It takes the CV text from the interview state, processes it through the LLM with the CVPrompt, and updates the interview state with the analysis results."""
    def __init__(self):
        self.llm = get_llm().with_structured_output(CVModel)

    def __call__(self, state: InterviewState): # we use __call__ method to make the class instance callable, allowing us to use it like a function.
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
