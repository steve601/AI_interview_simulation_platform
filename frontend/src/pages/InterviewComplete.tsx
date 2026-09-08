import React, { useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { Card } from '../components/UI/Card';
import { api } from '../services/api';
import { ApiError } from '../types';
import { AlertTriangle } from 'lucide-react';

export const InterviewComplete: React.FC = () => {
  const {
    threadId,
    setFinalReport,
    navigate,
    addToast,
    setApiError,
  } = useInterview();

  useEffect(() => {
    let isMounted = true;

    const loadReport = async () => {
      try {
        if (!threadId) {
          throw new Error(
            'Interview session is missing.'
          );
        }

        const response =
          await api.getFeedback(threadId);

        if (!response.feedback) {
          throw new Error(
            'The backend has not produced a feedback report yet.'
          );
        }

        if (!isMounted) {
          return;
        }

        setFinalReport(response);

        addToast({
          type: 'success',
          title: 'Final Evaluation Report Ready',
          message:
            'The backend evaluation report is ready.',
        });

        navigate('/report');
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const apiErr =
          err as ApiError;

        setApiError(apiErr);

        addToast({
          type: 'error',
          title: 'Report Unavailable',
          message:
            apiErr.detail ||
            apiErr.message ||
            'Unable to retrieve the evaluation report.',
        });
      }
    };

    loadReport();

    return () => {
      isMounted = false;
    };
  }, [threadId]);

  if (!threadId) {
    return (
      <Card className="border-red-300 bg-red-50/60">
        <div className="flex items-start space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />

          <div>
            <h3 className="text-sm font-bold text-red-900">
              Interview session unavailable
            </h3>

            <p className="text-xs text-red-800 mt-1">
              Start a new interview to generate a report.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="py-16 max-w-xl mx-auto">
      <LoadingSpinner
        size="lg"
        label="Finalizing Enterprise Candidate Evaluation Dossier..."
        subLabel="Retrieving the final evaluation report from the backend."
      />
    </div>
  );
};