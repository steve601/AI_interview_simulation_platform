import React from 'react';
import { FeedbackModel } from '../../types';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

export interface ReportCardProps {
  feedback: FeedbackModel;
}

export const ReportCard: React.FC<ReportCardProps> = ({ feedback }) => (
  <div className="space-y-6">
    <Card title="Interview Summary" className="border-[#CBD5E1]">
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <ReportField label="Candidate" value={feedback.candidate_name} />
        <ReportField label="Target Role" value={feedback.target_role} />
        <ReportField label="Organization" value={feedback.organization} />
      </div>
    </Card>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Score label="Overall Score" score={feedback.overall_score} />
      <Score label="Behavioral" score={feedback.behavioral_score} />
      <Score label="Technical" score={feedback.technical_score} />
      <Score label="System Design" score={feedback.system_design_score} />
    </div>

    <Card title="Assessment" className="border-[#CBD5E1]">
      <div className="flex flex-wrap gap-2">
        <Badge variant="gray">Performance: {feedback.score_band ?? 'Unavailable'}</Badge>
        <Badge variant="gray">Readiness: {feedback.role_readiness}</Badge>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#334155]">{feedback.overall_performance}</p>
    </Card>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TextSection title="Behavioral Performance" content={feedback.behavioral_performance} />
      <TextSection title="Technical Performance" content={feedback.technical_performance} />
      <TextSection title="System Design Performance" content={feedback.system_design_performance} />
    </div>

    <Card title="Strengths" className="border-[#CBD5E1]">
      <List items={feedback.strengths} emptyText="No strengths were provided." />
    </Card>

    <Card title="Areas for Improvement" className="border-[#CBD5E1]">
      {feedback.areas_for_improvement.length > 0 ? (
        <div className="space-y-4">
          {feedback.areas_for_improvement.map((item) => (
            <div key={item.area} className="border-b border-[#E2E8F0] pb-4 last:border-0 last:pb-0">
              <h3 className="font-semibold text-[#0F172A]">{item.area}</h3>
              <Detail label="Evidence" value={item.evidence} />
              <Detail label="Why It Matters" value={item.why_it_matters} />
              <Detail label="Improvement Action" value={item.improvement_action} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#64748B]">No improvement areas were provided.</p>
      )}
    </Card>

    <Card title="Recommended Next Steps" className="border-[#CBD5E1]">
      {feedback.recommended_next_steps.length > 0 ? (
        <div className="space-y-3">
          {feedback.recommended_next_steps.map((step, index) => (
            <div key={`${step.priority}-${index}`} className="flex flex-col gap-2 border-b border-[#E2E8F0] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start">
              <Badge variant="gray">{step.priority}</Badge>
              <p className="text-sm leading-6 text-[#334155]">{step.recommendation}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#64748B]">No next steps were provided.</p>
      )}
    </Card>

    <Card title="Final Feedback" className="border-[#CBD5E1]">
      <p className="text-sm leading-7 text-[#334155]">{feedback.final_feedback}</p>
    </Card>
  </div>
);

const ReportField: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
    <p className="mt-1 font-semibold text-[#0F172A]">{value ?? 'Not available'}</p>
  </div>
);

const Score: React.FC<{ label: string; score: number | null }> = ({ label, score }) => (
  <Card className="border-[#CBD5E1]">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
    <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">
      {score ?? 'N/A'}<span className="ml-1 text-sm font-normal text-[#64748B]">/ 100</span>
    </p>
  </Card>
);

const TextSection: React.FC<{ title: string; content: string | null }> = ({ title, content }) => (
  <Card title={title} className="border-[#CBD5E1]">
    <p className="text-sm leading-6 text-[#334155]">{content ?? 'Not available.'}</p>
  </Card>
);

const List: React.FC<{ items: string[]; emptyText: string }> = ({ items, emptyText }) => (
  items.length > 0 ? (
    <ul className="space-y-2 text-sm text-[#334155]">
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  ) : <p className="text-sm text-[#64748B]">{emptyText}</p>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mt-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
    <p className="mt-1 text-sm leading-6 text-[#334155]">{value}</p>
  </div>
);
