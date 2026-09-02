import React from 'react';
import { FinalReportData } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';
import { ScoreCard } from './ScoreCard';
import { FeedbackCard } from '../Feedback/FeedbackCard';
import { formatDate } from '../../utils';
import {
  Download,
  Printer,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  User,
  Building,
  Briefcase,
  FileText,
  Calendar
} from 'lucide-react';

export interface ReportCardProps {
  report: FinalReportData;
  onStartNew: () => void;
  onDownloadJSON?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onStartNew,
  onDownloadJSON
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-[#CBD5E1] rounded-sm no-print">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
            Final Candidate Evaluation Audit Report
          </h2>
          <p className="text-xs text-[#64748B]">
            Generated on {formatDate(report.completedAt)} • Document ID: {report.interviewId}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
            Print / Save PDF
          </Button>

          {onDownloadJSON && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadJSON}
              icon={<Download className="w-4 h-4" />}
            >
              Export JSON
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onStartNew}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Start New Interview
          </Button>
        </div>
      </div>

      {/* Printable Report Header */}
      <Card className="border-[#CBD5E1]">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E2E8F0] pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase bg-[#1E293B] text-white px-2 py-0.5 rounded-xs font-semibold">
                  PROMPTHIRE OFFICIAL AUDIT
                </span>
                <Badge
                  variant={
                    report.recommendation === 'Strong Hire' || report.recommendation === 'Hire'
                      ? 'green'
                      : 'amber'
                  }
                >
                  Recommendation: {report.recommendation}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-2">
                {report.candidateName} — Evaluation Dossier
              </h1>
            </div>

            <div className="text-right text-xs text-[#64748B] space-y-1 font-mono">
              <div>Session ID: {report.interviewId}</div>
              <div>Date: {formatDate(report.completedAt)}</div>
            </div>
          </div>

          {/* Candidate & Role Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#FAFAFA] p-3.5 border border-[#E2E8F0] rounded-xs">
            <div className="space-y-1">
              <span className="text-[#64748B] uppercase tracking-wider font-semibold block text-[10px]">
                Candidate Name
              </span>
              <div className="font-bold text-[#0F172A] text-sm flex items-center space-x-1.5">
                <User className="w-4 h-4 text-[#2563EB]" />
                <span>{report.candidateName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[#64748B] uppercase tracking-wider font-semibold block text-[10px]">
                Target Position
              </span>
              <div className="font-bold text-[#0F172A] text-sm flex items-center space-x-1.5">
                <Briefcase className="w-4 h-4 text-[#2563EB]" />
                <span>{report.jobTitle}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[#64748B] uppercase tracking-wider font-semibold block text-[10px]">
                Organization
              </span>
              <div className="font-bold text-[#0F172A] text-sm flex items-center space-x-1.5">
                <Building className="w-4 h-4 text-[#2563EB]" />
                <span>{report.company}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          label="Overall Composite Score"
          score={report.overallScore}
          subtitle={`Recommendation: ${report.recommendation}`}
          isOverall
        />
        <ScoreCard
          label="Behavioral Round"
          score={report.roundScores.behavioral}
          subtitle="Leadership, Culture & STAR"
        />
        <ScoreCard
          label="Technical Round"
          score={report.roundScores.technical}
          subtitle="React, TypeScript & Web Vitals"
        />
        <ScoreCard
          label="System Design Round"
          score={report.roundScores.systemDesign}
          subtitle="Scalability, CRDTs & Architecture"
        />
      </div>

      {/* Executive Feedback & Summary */}
      <FeedbackCard
        title="Executive Assessment & Final Synthesis"
        executiveSummary={report.executiveFeedback}
        strengths={report.keyStrengths}
        improvements={report.areasForImprovement}
      />

      {/* Recommended Learning Path */}
      {report.recommendedLearningPath && report.recommendedLearningPath.length > 0 && (
        <Card title="Recommended Professional Development & Action Plan" className="border-[#CBD5E1]">
          <div className="space-y-3">
            {report.recommendedLearningPath.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-sm font-bold text-[#0F172A]">{item.topic}</span>
                  </div>
                  <p className="text-xs text-[#334155]">{item.actionItem}</p>
                </div>

                <Badge
                  variant={
                    item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'amber' : 'gray'
                  }
                >
                  Priority: {item.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detailed Per-Question Answers Breakdown */}
      {report.detailedQuestionFeedbacks && report.detailedQuestionFeedbacks.length > 0 && (
        <Card title="Individual Question Evaluation Breakdown" className="border-[#CBD5E1]">
          <div className="space-y-4">
            {report.detailedQuestionFeedbacks.map((fb, idx) => (
              <div key={idx} className="p-4 border border-[#E2E8F0] rounded-xs bg-[#FAFAFA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2563EB] uppercase font-mono">
                    [{fb.roundType.toUpperCase()}] Item #{idx + 1}
                  </span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-blue-100 text-blue-900 rounded-xs">
                    Score: {fb.score} / 100
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#0F172A]">{fb.questionText}</h4>

                <div className="p-3 bg-white border border-[#CBD5E1] rounded-xs text-xs text-[#1E293B] font-serif leading-relaxed">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Candidate Answer
                  </span>
                  {fb.userAnswer}
                </div>

                <div className="text-xs text-[#334155] bg-blue-50/50 p-2.5 border border-blue-100 rounded-xs">
                  <span className="font-bold text-[#1D4ED8] block mb-0.5">Benchmarked Model Response Focus:</span>
                  {fb.sampleIdealResponse}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
