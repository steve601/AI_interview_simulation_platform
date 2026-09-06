from graph.main_graph import InterviewGraph

interview_graph = InterviewGraph()

def get_interview_graph():
    """
    Dependency used by FastAPI routes to access
    the PromptHire LangGraph application.
    """

    return interview_graph.app