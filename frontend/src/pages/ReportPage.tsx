import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { ReportCard } from '../components/Report/ReportCard';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { FinalReportData } from '../types';

export const ReportPage: React.FC = () => {
  const {
    threadId,
    finalReport,
    resetSession,
    navigate,
    addToast
  } = useInterview();

  if (!threadId || !finalReport?.feedback) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Breadcrumb />
        <p className="text-sm text-[#64748B]">The evaluation report is not available yet.</p>
      </div>
    );
  }

  const feedback = finalReport.feedback;
  const report: FinalReportData = {
    interviewId: threadId,
    candidateName: feedback.candidate_name,
    jobTitle: feedback.target_role,
    company: feedback.organization,
    completedAt: new Date().toISOString(),
    overallScore: feedback.overall_score ?? null,
    recommendation: feedback.score_band || 'Not available',
    roundScores: {
      behavioral: feedback.behavioral_score ?? null,
      technical: feedback.technical_score ?? null,
      systemDesign: feedback.system_design_score ?? null,
    },
    keyStrengths: feedback.strengths,
    areasForImprovement: feedback.areas_for_improvement,
    executiveFeedback: feedback.overall_performance,
    recommendedLearningPath: [],
    detailedQuestionFeedbacks: [],
  };

  const handleStartNew = () => {
    resetSession();
    navigate('/upload');
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PromptHire_Report_${report.candidateName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      type: 'success',
      title: 'Report Downloaded',
      message: 'Exported report JSON dossier to local downloads.'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Breadcrumb />

      <ReportCard
        report={report}
        onStartNew={handleStartNew}
        onDownloadJSON={handleDownloadJSON}
      />
    </div>
  );
};
