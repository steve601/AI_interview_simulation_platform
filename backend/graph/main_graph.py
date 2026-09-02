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

        # ==========================================
        # STATE GRAPH
        # ==========================================

        self.graph = StateGraph(InterviewState)

        # ==========================================
        # ANALYSIS NODES
        # ==========================================

        self.graph.add_node(
            "cv_analyzer",
            CVAnalyzerNode()
        )

        self.graph.add_node(
            "jd_analyzer",
            JDAnalyzerNode()
        )

        self.graph.add_node(
            "gap_analyzer",
            GapAnalyzerNode()
        )

        self.graph.add_node(
            "interview_planner",
            InterviewPlannerNode()
        )

        # analysis gate - pauses after planning so the
        # frontend can display the plan before starting
        self.graph.add_node(
            "analysis_gate",
            AnalysisGateNode()
        )

        # ==========================================
        # BEHAVIORAL
        # ==========================================

        self.graph.add_node(
            "behavioral_interviewer",
            BehavioralInterviewNode()
        )

        self.graph.add_node(
            "behavioral_answers_gate",
            AnswerGateNode()
        )

        self.graph.add_node(
            "behavioral_evaluator",
            BehavioralEvaluatorNode()
        )

        # ==========================================
        # TECHNICAL
        # ==========================================

        self.graph.add_node(
            "technical_interviewer",
            TechnicalInterviewNode()
        )

        self.graph.add_node(
            "technical_answers_gate",
            AnswerGateNode()
        )

        self.graph.add_node(
            "technical_evaluator",
            TechnicalEvaluatorNode()
        )

        # ==========================================
        # SYSTEM DESIGN
        # ==========================================

        self.graph.add_node(
            "system_design_interviewer",
            SystemDesignInterviewNode()
        )

        self.graph.add_node(
            "system_design_answers_gate",
            AnswerGateNode()
        )

        self.graph.add_node(
            "system_design_evaluator",
            SystemDesignEvaluatorNode()
        )

        # ==========================================
        # PROGRESS
        # ==========================================

        self.graph.add_node(
            "progress_manager",
            ProgressManagerNode()
        )

        # ==========================================
        # ROUND PAUSE
        # ==========================================

        self.graph.add_node(
            "round_transition",
            RoundTransitionNode()
        )

        # ==========================================
        # FINAL FEEDBACK
        # ==========================================

        self.graph.add_node(
            "feedback_agent",
            FeedbackNode()
        )

        # ==========================================
        # ANALYSIS FLOW  (plan generation only)
        # ==========================================

        self.graph.add_edge(
            START,
            "cv_analyzer"
        )

        self.graph.add_edge(
            "cv_analyzer",
            "jd_analyzer"
        )

        self.graph.add_edge(
            "jd_analyzer",
            "gap_analyzer"
        )

        self.graph.add_edge(
            "gap_analyzer",
            "interview_planner"
        )

        self.graph.add_edge(
            "interview_planner",
            "analysis_gate"
        )

        # ==========================================
        # START BEHAVIORAL ROUND
        # ==========================================

        self.graph.add_edge(
            "analysis_gate",
            "behavioral_interviewer"
        )
# ==========================================
        # BEHAVIORAL FLOW (interviewer -> answer gate)
        # ==========================================

        self.graph.add_edge(
            "behavioral_interviewer",
            "behavioral_answers_gate"
        )

        self.graph.add_edge(
            "behavioral_answers_gate",
            "progress_manager"
        )

        # ==========================================
        # PROGRESS ROUTING (shared across all rounds)
        # ==========================================

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
# ==========================================
        # PER-ROUND EVALUATOR ROUTING
        # ==========================================

        self.graph.add_edge(
            "behavioral_evaluator",
            "round_transition"
        )

        self.graph.add_edge(
            "technical_interviewer",
            "technical_answers_gate"
        )

        self.graph.add_edge(
            "technical_answers_gate",
            "progress_manager"
        )

        self.graph.add_edge(
            "technical_evaluator",
            "round_transition"
        )

        self.graph.add_edge(
            "system_design_interviewer",
            "system_design_answers_gate"
        )

        self.graph.add_edge(
            "system_design_answers_gate",
            "progress_manager"
        )

        self.graph.add_edge(
            "system_design_evaluator",
            "round_transition"
        )

        # ==========================================
        # AFTER ROUND PAUSE
        # ==========================================

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

        # ==========================================
        # FINAL FEEDBACK
        # ==========================================

        self.graph.add_edge(
            "feedback_agent",
            END
        )

        # ==========================================
        # CHECKPOINTER
        # ==========================================

        self.memory = MemorySaver()

        self.app = self.graph.compile(
            checkpointer=self.memory
        )