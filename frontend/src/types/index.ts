export type RoundType = 'behavioral' | 'technical' | 'system-design';

export type RoundStatus = 'not_started' | 'in_progress' | 'completed';

export interface CandidateInfo {
  fileName?: string;
  fileSize?: string;
  /** Raw File object kept client-side for the multipart upload to /generate-plan */
  rawFile?: File;
  candidateName: string;
  email: string;
  yearsOfExperience: number;
  extractedSkills: string[];
  extractedText: string;
}

export interface JobDescriptionInfo {
  jobTitle: string;
  company: string;
  department: string;
  location: string;
  keyRequirements: string[];
  fullText: string;
}

export interface Question {
  id: string;
  roundType: RoundType;
  questionNumber: number;
  totalQuestionsInRound: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff / Executive';
  expectedFocusAreas: string[];
  hint?: string;
}

export interface AnswerRecord {
  questionId: string;
  roundType: RoundType;
  questionNumber: number;
  questionText: string;
  userAnswer: string;
  submittedAt: string;
  wordCount: number;
}

export interface RoundPlan {
  roundType: RoundType;
  title: string;
  questionCount: number;
  estimatedMinutes: number;
  status: RoundStatus;
  description: string;
  topicsCovered: string[];
}

export interface SkillGapItem {
  skill: string;
  status: 'Matched' | 'Partial' | 'Gap' | 'Core Focus';
  description: string;
}

export interface InterviewPlanData {
  candidateSummary: {
    name: string;
    headline: string;
    keySkills: string[];
    experienceLevel: string;
    fitRating: string;
  };
  jobSummary: {
    roleTitle: string;
    companyName: string;
    targetLevel: string;
    coreCompetencies: string[];
  };
  skillGaps: SkillGapItem[];
  roundsPlan: RoundPlan[];
  totalEstimatedMinutes: number;
  generatedAt: string;
}

export interface QuestionFeedback {
  questionId: string;
  roundType: RoundType;
  questionText: string;
  userAnswer: string;
  score: number; // 0 - 100
  strengths: string[];
  improvements: string[];
  sampleIdealResponse: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

/* ---------- Backend contract types (mirror models/*.py) ---------- */

/** A message in the interview conversation (interviewer or candidate). */
export interface InterviewMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** A typed API error surfaced to the UI. */
export interface ApiError extends Error {
  status?: number;
  detail?: string;
}

/**
 * Shape returned by POST /api/analysis/generate-plan.
 * Mirrors backend/api/routes/analysis.py response + models.
 */
export interface InterviewPlanBackend {
  thread_id: string;
  cv_analysis: {
    cv_id: string;
    candidate_name: string;
    professional_level?: string | null;
    years_of_experience?: number | null;
    education?: Record<string, unknown> | null;
    technical_skills?: Record<string, unknown> | null;
    projects?: unknown[] | null;
    certifications?: unknown[] | null;
  };
  jd_analysis: {
    jd_id: string;
    job_title: string;
    company_name: string;
    department?: string | null;
    employment_type?: string | null;
    required_technical_skills?: string[] | null;
    preferred_technical_skills?: string[] | null;
    tools_and_technologies?: string[] | null;
    education_requirements?: string[] | null;
    experience_requirements?: string[] | null;
    interview_priorities?: string[] | null;
    responsibilities?: string[] | null;
    qualifications?: string[] | null;
  };
  gap_analysis: {
    candidate_skills: string[];
    required_skills: string[];
    skill: string;
    score_band?: string | null;
    explanation?: string | null;
  };
  interview_plan: {
    behavioral: {
      number_of_questions: number;
      topics: string[];
      question_objectives: string[];
      evaluation_criteria: string[];
      follow_up_strategy: string;
    };
    technical: {
      number_of_questions: number;
      topics: string[];
      difficulty_progression: string[];
      question_objectives: string[];
      evaluation_criteria: string[];
      follow_up_strategy: string;
    };
    system_design: {
      number_of_questions: number;
      design_topics: string[];
      evaluation_criteria: string[];
      expected_discussion_areas: string[];
      follow_up_strategy: string;
    };
  };
}

/**
 * Shape returned by GET /api/feedback/{thread_id}.
 * Mirrors backend/api/routes/feedback.py + models/feedback_model.py.
 */
export type ScoreBand =
  | 'Excellent'
  | 'Good'
  | 'Average'
  | 'Below Average';

export type ReadinessBand =
  | 'Strong alignment'
  | 'Good alignment'
  | 'Partial alignment'
  | 'Significant development needed';

export type PriorityLevel =
  | 'High Priority'
  | 'Medium Priority'
  | 'Low Priority';

export interface ImprovementItem {
  area: string;
  evidence: string;
  why_it_matters: string;
  improvement_action: string;
}

export interface NextStep {
  priority: PriorityLevel;
  recommendation: string;
}

export interface FeedbackModel {
  candidate_name: string | null;
  target_role: string | null;
  organization: string | null;

  overall_score: number | null;
  score_band: ScoreBand | null;

  behavioral_score: number | null;
  technical_score: number | null;
  system_design_score: number | null;

  overall_performance: string;

  behavioral_performance: string | null;
  technical_performance: string | null;
  system_design_performance: string | null;

  strengths: string[];

  areas_for_improvement: ImprovementItem[];

  role_readiness: ReadinessBand;

  recommended_next_steps: NextStep[];

  final_feedback: string;
}

export interface FeedbackResponseBackend {
  status: string;

  feedback: FeedbackModel | null;

  behavioral_evaluation: unknown;
  technical_evaluation: unknown;
  system_design_evaluation: unknown;

  interview_completed: boolean;
}


