import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import {
  Play,
  FileCheck2,
  ShieldCheck,
  Cpu,
  Layers,
  Bot,
  UserCheck,
  ArrowRight,
  BarChart3
} from 'lucide-react';


export const Home: React.FC = () => {
  const { navigate, finalReport, resetSession } = useInterview();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumb />

      {/* Hero Section */}
      <div className="bg-white border border-[#CBD5E1] rounded-sm p-8 sm:p-10 shadow-2xs relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-blue-50 border border-blue-200 text-[#2563EB] rounded-xs text-xs font-semibold">
            <Bot className="w-4 h-4" />
            <span>Enterprise AI Interview Simulator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-serif leading-tight">
            AI Interview Simulator
          </h1>

          <p className="text-base sm:text-lg text-[#334155] font-serif leading-relaxed">
            PromptHire conducts automated, multi-round technical and behavioral interviews. Upload candidate
            resumes and job descriptions to generate tailored competency rubrics.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/upload')}
              icon={<Play className="w-4.5 h-4.5 fill-current" />}
            >
              Start Interview
            </Button>

                        <Button
              variant="outline"
              size="lg"
              onClick={resetSession}
              icon={<FileCheck2 className="w-4.5 h-4.5 text-[#2563EB]" />}
            >
              New Session
            </Button>
          </div>
        </div>
      </div>

      {/* Core Evaluation Rounds Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
            Structured 3-Round Assessment Pipeline
          </h2>
          <span className="text-xs text-[#64748B] font-mono">Standardized Rubrics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Behavioral Card */}
          <Card className="hover:border-[#2563EB] transition-colors cursor-pointer" onClick={() => navigate('/upload')}>
            <div className="space-y-3">
              <div className="w-9 h-9 bg-blue-50 text-[#2563EB] border border-blue-100 rounded-xs flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Behavioral & Leadership</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Evaluates conflict resolution, STAR methodology, team mentorship, and cross-functional alignment.
              </p>
              <div className="pt-2 flex items-center text-xs font-semibold text-[#2563EB]">
                <span>8 Questions • ~20 Mins</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </Card>

          {/* Technical Card */}
          <Card className="hover:border-[#2563EB] transition-colors cursor-pointer" onClick={() => navigate('/upload')}>
            <div className="space-y-3">
              <div className="w-9 h-9 bg-blue-50 text-[#2563EB] border border-blue-100 rounded-xs flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Technical Depth</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Evaluates coding proficiency, algorithmic thinking, system architecture, and problem-solving skills.
              </p>
              <div className="pt-2 flex items-center text-xs font-semibold text-[#2563EB]">
                <span>10 Questions • ~25 Mins</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </Card>

          {/* System Design Card */}
          <Card className="hover:border-[#2563EB] transition-colors cursor-pointer" onClick={() => navigate('/upload')}>
            <div className="space-y-3">
              <div className="w-9 h-9 bg-blue-50 text-[#2563EB] border border-blue-100 rounded-xs flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">System Design</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Evaluates system architecture, scalability, database design, and API integration skills through scenario-based questions.
              </p>
              <div className="pt-2 flex items-center text-xs font-semibold text-[#2563EB]">
                <span>5 Questions • ~20 Mins</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </Card>
        </div>
      </div>

            {/* Previous Report Link */}
      {finalReport && (
        <Card title="Active Session Dossier" className="border-[#2563EB]/40 bg-blue-50/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="green">Dossier Available</Badge>
              </div>
              <p className="text-sm font-bold text-[#0F172A]">
                {finalReport.candidate_name} — {finalReport.target_role}
              </p>
              <p className="text-xs text-[#64748B]">
                Overall Score: <span className="font-bold text-[#2563EB] font-mono">{finalReport.overall_score ?? 'N/A'}/100</span> ({finalReport.score_band || 'N/A'})
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={() => navigate('/report')} icon={<BarChart3 className="w-4 h-4" />}>
              Open Evaluation Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
