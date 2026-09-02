import React from 'react';
import { useInterview } from './context/InterviewContext';
import { Home } from './pages/Home';
import { UploadPage } from './pages/UploadPage';
import { InterviewPlan } from './pages/InterviewPlan';
import { BehavioralInterview } from './pages/BehavioralInterview';
import { TechnicalInterview } from './pages/TechnicalInterview';
import { SystemDesignInterview } from './pages/SystemDesignInterview';
import { InterviewComplete } from './pages/InterviewComplete';
import { ReportPage } from './pages/ReportPage';

export const AppRoutes: React.FC = () => {
  const { activePath } = useInterview();

  switch (activePath) {
    case '/':
      return <Home />;
    case '/upload':
      return <UploadPage />;
    case '/plan':
      return <InterviewPlan />;
    case '/interview/behavioral':
      return <BehavioralInterview />;
    case '/interview/technical':
      return <TechnicalInterview />;
    case '/interview/system-design':
      return <SystemDesignInterview />;
    case '/interview/complete':
      return <InterviewComplete />;
    case '/report':
      return <ReportPage />;
    default:
      return <Home />;
  }
};
