import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { Breadcrumb } from '../components/Common/Breadcrumb';

export const ReportPage: React.FC = () => {
  const {
    threadId,
    finalReport,
    resetSession,
    navigate,
    addToast,
  } = useInterview();

  if (!threadId || !finalReport?.feedback) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Breadcrumb />

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">
            The evaluation report is not available yet.
          </p>
        </div>
      </div>
    );
  }

  const feedback = finalReport.feedback;

  const handleStartNew = () => {
    resetSession();
    navigate('/upload');
  };

  const handleDownloadJSON = () => {
    const data = JSON.stringify(feedback, null, 2);

    const blob = new Blob([data], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `PromptHire_Report_${
      feedback.candidate_name || 'Candidate'
    }.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Report Downloaded',
      message: 'Interview feedback exported successfully.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <Breadcrumb />

      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Interview Report
            </h1>

            <div className="mt-3 space-y-1 text-sm text-slate-500">
              {feedback.candidate_name && (
                <p>
                  Candidate:{' '}
                  <span className="font-medium text-slate-700">
                    {feedback.candidate_name}
                  </span>
                </p>
              )}

              {feedback.target_role && (
                <p>
                  Target Role:{' '}
                  <span className="font-medium text-slate-700">
                    {feedback.target_role}
                  </span>
                </p>
              )}

              {feedback.organization && (
                <p>
                  Organization:{' '}
                  <span className="font-medium text-slate-700">
                    {feedback.organization}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadJSON}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Download JSON
            </button>

            <button
              onClick={handleStartNew}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </section>

      {/* Score Overview */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <ScoreCard
          title="Overall Score"
          score={feedback.overall_score}
        />

        <ScoreCard
          title="Behavioral"
          score={feedback.behavioral_score}
        />

        <ScoreCard
          title="Technical"
          score={feedback.technical_score}
        />

        <ScoreCard
          title="System Design"
          score={feedback.system_design_score}
        />
      </section>

      {/* Score Band / Readiness */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoCard
          title="Performance Band"
          value={feedback.score_band}
        />

        <InfoCard
          title="Role Readiness"
          value={feedback.role_readiness}
        />
      </section>

      {/* Overall Performance */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title="Overall Performance" />

        <p className="mt-4 text-sm leading-7 text-slate-600">
          {feedback.overall_performance}
        </p>
      </section>

      {/* Round Performance */}
      <section>
        <SectionTitle title="Round Performance" />

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <PerformanceCard
            title="Behavioral Interview"
            content={feedback.behavioral_performance}
          />

          <PerformanceCard
            title="Technical Interview"
            content={feedback.technical_performance}
          />

          <PerformanceCard
            title="System Design"
            content={feedback.system_design_performance}
          />
        </div>
      </section>

      {/* Strengths */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title="Key Strengths" />

        {feedback.strengths.length > 0 ? (
          <div className="mt-4 space-y-3">
            {feedback.strengths.map((strength, index) => (
              <div
                key={index}
                className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700"
              >
                {strength}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Areas For Improvement */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title="Areas for Improvement" />

        {feedback.areas_for_improvement.length > 0 ? (
          <div className="mt-5 space-y-5">
            {feedback.areas_for_improvement.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-5"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {item.area}
                </h3>

                <div className="mt-4 space-y-4">
                  <Detail
                    title="Evidence"
                    content={item.evidence}
                  />

                  <Detail
                    title="Why It Matters"
                    content={item.why_it_matters}
                  />

                  <Detail
                    title="Improvement Action"
                    content={item.improvement_action}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Recommended Next Steps */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title="Recommended Next Steps" />

        {feedback.recommended_next_steps.length > 0 ? (
          <div className="mt-5 space-y-4">
            {feedback.recommended_next_steps.map((step, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="inline-flex w-fit rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {step.priority}
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    {step.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Final Feedback */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title="Final Feedback" />

        <p className="mt-4 text-sm leading-7 text-slate-600">
          {feedback.final_feedback}
        </p>
      </section>

      {/* Interview Status */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Interview Status
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {finalReport.interview_completed
              ? 'Completed'
              : 'In Progress'}
          </span>
        </div>
      </section>
    </div>
  );
};


/* -------------------------------- */
/* Score Card                        */
/* -------------------------------- */

interface ScoreCardProps {
  title: string;
  score: number | null;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <div className="mt-2">
        <span className="text-3xl font-bold text-slate-900">
          {score ?? 'N/A'}
        </span>

        {score !== null && (
          <span className="ml-1 text-sm text-slate-400">
            /100
          </span>
        )}
      </div>
    </div>
  );
};


/* -------------------------------- */
/* Info Card                         */
/* -------------------------------- */

interface InfoCardProps {
  title: string;
  value: string | null;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-base font-semibold text-slate-900">
        {value ?? 'Not available'}
      </p>
    </div>
  );
};


/* -------------------------------- */
/* Performance Card                  */
/* -------------------------------- */

interface PerformanceCardProps {
  title: string;
  content: string | null;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  content,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {content || 'Not available.'}
      </p>
    </div>
  );
};


/* -------------------------------- */
/* Section Title                     */
/* -------------------------------- */

const SectionTitle: React.FC<{ title: string }> = ({
  title,
}) => {
  return (
    <h2 className="text-lg font-semibold text-slate-900">
      {title}
    </h2>
  );
};


/* -------------------------------- */
/* Detail                            */
/* -------------------------------- */

interface DetailProps {
  title: string;
  content: string;
}

const Detail: React.FC<DetailProps> = ({
  title,
  content,
}) => {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {content}
      </p>
    </div>
  );
};


/* -------------------------------- */
/* Empty State                       */
/* -------------------------------- */

const EmptyState: React.FC = () => {
  return (
    <p className="mt-4 text-sm text-slate-500">
      No information was provided.
    </p>
  );
};
