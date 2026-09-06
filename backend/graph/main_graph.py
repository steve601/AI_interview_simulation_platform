from langgraph.graph import START, END, StateGraph
from langgraph.checkpoint.memory import MemorySaver
from state.interviewstate import InterviewState
from nodes.cv_analyerNode import CVAnalyzerNode
from nodes.jd_analyzerNode import JDAnalyzerNode
from nodes.gap_analyzerNode import GapAnalyzerNode
from nodes.interview_plannerNode import InterviewPlannerNode
from nodes.behavioralIntNode import BehavioralInterviewNode
from nodes.behavioralEvalNode import BehavioralEvaluatorNode
from nodes.technicalIntNode import TechnicalInterviewNode
from nodes.technicalEvalNode import TechnicalEvaluatorNode
from nodes.systemdesignIntNode import SystemDesignInterviewNode
from nodes.systemdesignEvalNode import SystemDesignEvaluatorNode
from nodes.progressManagerNode import ProgressManagerNode
from nodes.roundTransitionNode import RoundTransitionNode
from nodes.analysisGateNode import AnalysisGateNode
from nodes.answerGateNode import AnswerGateNode
from nodes.feedbackNode import FeedbackNode
from graph.routing import Routing


class InterviewGraph:

    def __init__(self):

        # initializing state graph using the InterviewState class
        self.graph = StateGraph(InterviewState)

        # adding nodes to the graph
        self.graph.add_node("cv_analyzer",CVAnalyzerNode())
        self.graph.add_node("jd_analyzer",JDAnalyzerNode())
        self.graph.add_node("gap_analyzer",GapAnalyzerNode())
        self.graph.add_node("interview_planner",InterviewPlannerNode())

        # adding the analysis gate node to the graph, it interrupts the graph after the interview plan is generated and returns the analysis results to the frontend.
        self.graph.add_node("analysis_gate",AnalysisGateNode())

        # interview nodes for each round of the interview process, including behavioral, technical, and system design rounds. Each has interrupt nodes for the answers and evaluators for each round.
        self.graph.add_node("behavioral_interviewer",BehavioralInterviewNode())
        self.graph.add_node("behavioral_answers_gate",AnswerGateNode())
        self.graph.add_node("behavioral_evaluator",BehavioralEvaluatorNode())

        self.graph.add_node("technical_interviewer",TechnicalInterviewNode())
        self.graph.add_node("technical_answers_gate",AnswerGateNode())
        self.graph.add_node("technical_evaluator",TechnicalEvaluatorNode())

        self.graph.add_node("system_design_interviewer",SystemDesignInterviewNode())
        self.graph.add_node("system_design_answers_gate",AnswerGateNode())
        self.graph.add_node("system_design_evaluator",SystemDesignEvaluatorNode())

        # progress manager node to manage the progress of the interview rounds and determine if the current round has been completed based on the number of questions defined in the InterviewPlanModel.
        self.graph.add_node("progress_manager",ProgressManagerNode())

        # round transition node to handle the transition between interview rounds and route to the next round or the final feedback node based on the current state.
        self.graph.add_node("round_transition",RoundTransitionNode())

        # feedback node to collect feedback from the candidate after the interview process is completed.
        self.graph.add_node("feedback_agent",FeedbackNode())

        # analysis flow (cv analysis -> jd analysis -> gap analysis -> interview planner -> analysis gate)
        self.graph.add_edge(START,"cv_analyzer")
        self.graph.add_edge("cv_analyzer","jd_analyzer")
        self.graph.add_edge("jd_analyzer","gap_analyzer")
        self.graph.add_edge("gap_analyzer","interview_planner")
        self.graph.add_edge("interview_planner","analysis_gate")

        # behavioral round
        self.graph.add_edge("analysis_gate","behavioral_interviewer")
        self.graph.add_edge("behavioral_interviewer","behavioral_answers_gate")
        self.graph.add_edge("behavioral_answers_gate","progress_manager")
        self.graph.add_edge("behavioral_evaluator","round_transition")

        # technical round
        self.graph.add_edge("technical_interviewer","technical_answers_gate")
        self.graph.add_edge("technical_answers_gate","progress_manager")
        self.graph.add_edge("technical_evaluator","round_transition")

        # system design round
        self.graph.add_edge("system_design_interviewer","system_design_answers_gate")
        self.graph.add_edge("system_design_answers_gate","progress_manager")
        self.graph.add_edge("system_design_evaluator","round_transition")

        # progress routing, shared across all rounds
        self.graph.add_conditional_edges(
            "progress_manager",
            Routing.route_after_progress,
            {
                "behavioral_interviewer":
                    "behavioral_interviewer",

                "behavioral_evaluator":
                    "behavioral_evaluator",

                "technical_interviewer":
                    "technical_interviewer",

                "technical_evaluator":
                    "technical_evaluator",

                "system_design_interviewer":
                    "system_design_interviewer",

                "system_design_evaluator":
                    "system_design_evaluator",
            }
        )

        # round transition routing, shared across all rounds
        self.graph.add_conditional_edges(
            "round_transition",
            Routing.route_after_round_transition,
            {
                "technical":
                    "technical_interviewer",

                "system_design":
                    "system_design_interviewer",

                "completed":
                    "feedback_agent",
            }
        )

        # final feedback node, which is the end of the graph
        self.graph.add_edge(
            "feedback_agent",
            END
        )

        # checkpointer to save the state of the graph in memory, allowing for resuming the graph from the last checkpoint in case of interruptions or failures.
        self.memory = MemorySaver()
        self.app = self.graph.compile(
            checkpointer=self.memory
        )