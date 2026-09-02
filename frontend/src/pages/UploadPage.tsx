import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { FileUpload } from '../components/Upload/FileUpload';
import { Textarea } from '../components/UI/Textarea';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { api, ApiError } from '../services/api';
import { ArrowRight, Info } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const {
    candidate,
    setCandidate,
    setJobDescription,
    setInterviewPlan,
    setCvAnalysis,
    setJdAnalysis,
    setGapAnalysis,
    setThreadId,
    isGeneratingPlan,
    setIsGeneratingPlan,
    navigate,
    addToast,
    setApiError
  } = useInterview();

    const [jdInput, setJdInput] = useState('');

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdInput.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Job Description',
        message: 'Please paste or type a Job Description.'
      });
      return;
    }

    if (!candidate.fileName) {
      addToast({
        type: 'error',
        title: 'CV Not Uploaded',
        message: 'Please upload a candidate CV before generating the plan.'
      });
      return;
    }

    if (!candidate.rawFile) {
      addToast({
        type: 'error',
        title: 'CV File Unavailable',
        message: 'Please remove the CV and upload it again before generating the plan.'
      });
      return;
    }

    setIsGeneratingPlan(true);
    setApiError(null);
    try {
      const data = await api.generatePlan(
        candidate.rawFile,
        jdInput
      );

      // Store the thread_id from the backend for the entire interview session
      setThreadId(data.thread_id);

      // Store the real backend analysis results
      setCvAnalysis(data.cv_analysis);
      setJdAnalysis(data.jd_analysis);
      setGapAnalysis(data.gap_analysis);
      setInterviewPlan(data.interview_plan);

      // Populate candidate/JD info from backend results
      setCandidate({
        candidateName: data.cv_analysis.candidate_name,
        email: '',
        yearsOfExperience: data.cv_analysis.years_of_experience ?? 0,
        extractedSkills: Array.isArray(data.cv_analysis.technical_skills)
          ? data.cv_analysis.technical_skills as string[]
          : (data.cv_analysis.technical_skills
              ? Object.values(data.cv_analysis.technical_skills as Record<string, string[]>)
                  .flat()
              : []),
        extractedText: '',
      });

      setJobDescription({
        jobTitle: data.jd_analysis.job_title,
        company: data.jd_analysis.company_name,
        department: data.jd_analysis.department || '',
        location: '',
        keyRequirements: data.jd_analysis.required_technical_skills || [],
        fullText: jdInput,
      });

      addToast({
        type: 'success',
        title: 'Interview Plan Generated',
        message: '3-Round evaluation matrix generated based on candidate CV and JD.'
      });

      navigate('/plan');
    } catch (err) {
      const apiErr = err as ApiError;
      setApiError(apiErr);
      addToast({
        type: 'error',
        title: 'Generation Error',
        message: apiErr.detail || 'Unable to generate plan. Please try again.'
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  if (isGeneratingPlan) {
    return (
      <div className="py-12">
        <LoadingSpinner
          size="lg"
          label="Synthesizing AI Interview Matrix..."
          subLabel="Mapping candidate skills against Job Description core requirements. Generating 23 tailored behavioral, technical, and system design questions."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumb />

      <div className="border-b border-[#E2E8F0] pb-3">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
          Candidate CV & Job Description Ingestion
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Upload candidate credentials and target job description to build a customized evaluation plan.
        </p>
      </div>

            <form onSubmit={handleGeneratePlan} className="space-y-6">
        {/* Step 1: Upload CV */}
        <Card
          title="Step 1: Candidate Curriculum Vitae (PDF)"
          subtitle="Required for skill extraction & experience depth benchmarking"
        >
          <FileUpload />
        </Card>

        {/* Step 2: Paste Job Description */}
        <Card
          title="Step 2: Role & Job Description Requirements"
        >
          <div className="space-y-3">
            <Textarea
              label="Job Description Text"
              value={jdInput}
              onChange={(e) => setJdInput(e.target.value)}
              placeholder="Paste the full job description here (e.g. Responsibilities, Required Qualifications, Competencies)..."
              rows={10}
              required
            />

            <p className="text-xs text-[#64748B] flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                Tip: Higher detail in the Job Description produces sharper, role-specific technical questions.
              </span>
            </p>
          </div>
        </Card>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
                        disabled={!jdInput.trim() || !candidate.fileName || isGeneratingPlan}
            icon={<ArrowRight className="w-4.5 h-4.5" />}
          >
            Generate Interview Plan
          </Button>
        </div>
      </form>
    </div>
  );
};
