import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CandidateInfo,
  JobDescriptionInfo,
  InterviewPlanBackend,
  FeedbackResponseBackend,
  RoundType,
  ToastMessage,
  InterviewMessage,
  ApiError
} from '../types';

interface RoundProgressState {
  behavioral: { completed: boolean; answeredCount: number; totalCount: number };
  technical: { completed: boolean; answeredCount: number; totalCount: number };
  'system-design': { completed: boolean; answeredCount: number; totalCount: number };
}

interface InterviewContextType {
  // Backend session / thread
  threadId: string | null;
  setThreadId: (id: string | null) => void;

  // Candidate & JD
  candidate: CandidateInfo;
  setCandidate: React.Dispatch<React.SetStateAction<CandidateInfo>>;
  jobDescription: JobDescriptionInfo;
  setJobDescription: React.Dispatch<React.SetStateAction<JobDescriptionInfo>>;

  // Backend analysis results (real, from API)
  cvAnalysis: InterviewPlanBackend['cv_analysis'] | null;
  setCvAnalysis: (v: InterviewPlanBackend['cv_analysis'] | null) => void;
  jdAnalysis: InterviewPlanBackend['jd_analysis'] | null;
  setJdAnalysis: (v: InterviewPlanBackend['jd_analysis'] | null) => void;
  gapAnalysis: InterviewPlanBackend['gap_analysis'] | null;
  setGapAnalysis: (v: InterviewPlanBackend['gap_analysis'] | null) => void;
  interviewPlan: InterviewPlanBackend['interview_plan'] | null;
  setInterviewPlan: (v: InterviewPlanBackend['interview_plan'] | null) => void;

  // Interview streaming
  interviewMessages: InterviewMessage[];
  setInterviewMessages: React.Dispatch<React.SetStateAction<InterviewMessage[]>>;
  appendMessage: (msg: InterviewMessage) => void;
  currentRound: RoundType;
  setCurrentRound: (round: RoundType) => void;
  isLoadingInterview: boolean;
  setIsLoadingInterview: (v: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;

  // Final report (full backend feedback response)
  finalReport: FeedbackResponseBackend | null;
  setFinalReport: (v: FeedbackResponseBackend | null) => void;
  isGeneratingReport: boolean;
  setIsGeneratingReport: (v: boolean) => void;
  isGeneratingPlan: boolean;
  setIsGeneratingPlan: (v: boolean) => void;

  // Error state
  apiError: ApiError | null;
  setApiError: (err: ApiError | null) => void;

  // Navigation / UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePath: string;
  navigate: (path: string) => void;
  roundProgress: RoundProgressState;
  setRoundProgress: React.Dispatch<React.SetStateAction<RoundProgressState>>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Actions
  resetSession: () => void;
  loadSampleSession: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

const emptyCandidate: CandidateInfo = {
  candidateName: '',
  email: '',
  yearsOfExperience: 0,
  extractedSkills: [],
  extractedText: '',
};

const emptyJobDescription: JobDescriptionInfo = {
  jobTitle: '',
  company: '',
  department: '',
  location: '',
  keyRequirements: [],
  fullText: '',
};

const defaultRoundProgress: RoundProgressState = {
  behavioral: { completed: false, answeredCount: 0, totalCount: 8 },
  technical: { completed: false, answeredCount: 0, totalCount: 10 },
  'system-design': { completed: false, answeredCount: 0, totalCount: 5 },
};

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<CandidateInfo>(emptyCandidate);
  const [jobDescription, setJobDescription] = useState<JobDescriptionInfo>(emptyJobDescription);
  const [cvAnalysis, setCvAnalysis] = useState<InterviewPlanBackend['cv_analysis'] | null>(null);
  const [jdAnalysis, setJdAnalysis] = useState<InterviewPlanBackend['jd_analysis'] | null>(null);
  const [gapAnalysis, setGapAnalysis] = useState<InterviewPlanBackend['gap_analysis'] | null>(null);
  const [interviewPlan, setInterviewPlan] = useState<InterviewPlanBackend['interview_plan'] | null>(null);

  const [interviewMessages, setInterviewMessages] = useState<InterviewMessage[]>([]);
  const [currentRound, setCurrentRound] = useState<RoundType>('behavioral');
  const [isLoadingInterview, setIsLoadingInterview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [finalReport, setFinalReport] = useState<FeedbackResponseBackend | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  const [apiError, setApiError] = useState<ApiError | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activePath, setActivePath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [roundProgress, setRoundProgress] = useState<RoundProgressState>(defaultRoundProgress);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync route path with browser history
  useEffect(() => {
    const handlePopState = () => {
      setActivePath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setActivePath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const appendMessage = (msg: InterviewMessage) => {
    setInterviewMessages((prev) => [...prev, msg]);
  };

  // Reset Session — clears all backend-derived state
  const resetSession = () => {
    setThreadId(null);
    setCandidate(emptyCandidate);
    setJobDescription(emptyJobDescription);
    setCvAnalysis(null);
    setJdAnalysis(null);
    setGapAnalysis(null);
    setInterviewPlan(null);
    setInterviewMessages([]);
    setCurrentRound('behavioral');
    setIsLoadingInterview(false);
    setIsSubmitting(false);
    setFinalReport(null);
    setIsGeneratingReport(false);
    setIsGeneratingPlan(false);
    setApiError(null);
    setRoundProgress(defaultRoundProgress);
    addToast({ type: 'info', title: 'Session Reset', message: 'Ready for a new interview session.' });
  };

  const loadSampleSession = () => {
    setCandidate({
      candidateName: 'Alicia Johnson',
      email: 'alicia.johnson@example.com',
      yearsOfExperience: 6,
      extractedSkills: ['React', 'TypeScript', 'System Design', 'Leadership'],
      extractedText: 'Senior frontend engineer with experience leading platform initiatives and mentoring engineers.',
    });
    setJobDescription({
      jobTitle: 'Senior Frontend Engineer',
      company: 'Microsoft',
      department: 'Core Experiences',
      location: 'Remote',
      keyRequirements: ['React', 'TypeScript', 'Performance optimization', 'System design'],
      fullText: 'Senior Frontend Engineer responsible for building reliable, performant user experiences across enterprise products.',
    });
    setRoundProgress({
      behavioral: { completed: false, answeredCount: 0, totalCount: 8 },
      technical: { completed: false, answeredCount: 0, totalCount: 10 },
      'system-design': { completed: false, answeredCount: 0, totalCount: 5 },
    });
    setActivePath('/upload');
    addToast({ type: 'success', title: 'Sample session loaded', message: 'Demo candidate and role data are ready.' });
  };

  return (
    <InterviewContext.Provider
      value={{
        threadId,
        setThreadId,
        candidate,
        setCandidate,
        jobDescription,
        setJobDescription,
        cvAnalysis,
        setCvAnalysis,
        jdAnalysis,
        setJdAnalysis,
        gapAnalysis,
        setGapAnalysis,
        interviewPlan,
        setInterviewPlan,
        interviewMessages,
        setInterviewMessages,
        appendMessage,
        currentRound,
        setCurrentRound,
        isLoadingInterview,
        setIsLoadingInterview,
        isSubmitting,
        setIsSubmitting,
        finalReport,
        setFinalReport,
        isGeneratingReport,
        setIsGeneratingReport,
        isGeneratingPlan,
        setIsGeneratingPlan,
        apiError,
        setApiError,
        sidebarOpen,
        setSidebarOpen,
        activePath,
        navigate,
        roundProgress,
        setRoundProgress,
        toasts,
        addToast,
        removeToast,
        resetSession,
        loadSampleSession,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};