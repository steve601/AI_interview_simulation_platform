import React, { useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import {
  Play,
  User,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Code,
  Layers,
} from 'lucide-react';
// Helper for displaying arrays and dictionaries
const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'Not specified';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Not specified';
    return value
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return Object.entries(item)
            .map(([key, val]) => `${key}: ${formatValue(val)}`)
            .join(' • ');
        }
        return String(item);
      })
      .join(', ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${formatValue(val)}`)
      .join(' • ');
  }

  return String(value);
};
// Helper for displaying lists as bullet points
const ListContent: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-xs text-[#64748B]">
        Not specified
      </p>
    );
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li
          key={index}
          className="text-xs text-[#334155] font-serif leading-relaxed flex items-start"
        >
          <span className="mr-2 text-[#2563EB]">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};
export const InterviewPlan: React.FC = () => {
  const {
    threadId,
    interviewPlan,
    cvAnalysis,
    jdAnalysis,
    gapAnalysis,
    navigate,
    setCurrentRound,
  } = useInterview();

  // If the user lands here without a generated plan, send them back to upload.
  useEffect(() => {
    if (!interviewPlan || !threadId) {
      navigate('/');
    }
  }, [interviewPlan, threadId, navigate]);

  if (!interviewPlan || !threadId) {
    return (
      <div className="py-12">
        <LoadingSpinner
          size="lg"
          label="Loading interview plan..."
        />
      </div>
    );
  }

  // Backend analysis results (stored separately in context by UploadPage)
  const cv = cvAnalysis;
  const jd = jdAnalysis;
  // Gap analysis is a single object per the backend contract
  const gaps = gapAnalysis ? [gapAnalysis] : [];
  // Actual planner models
  const behavioral = interviewPlan.behavioral;
  const technical = interviewPlan.technical;
  const systemDesign = interviewPlan.system_design;
  const handleStartInterview = () => {
    setCurrentRound('behavioral');
    navigate('/interview/behavioral');
  };
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Breadcrumb />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Synthesized AI Interview Assessment Plan
          </h1>

          <p className="text-xs text-[#64748B] mt-1">
            Targeted interview plan created for{' '}
            <span className="font-semibold">
              {cv?.candidate_name || 'Candidate'}
            </span>{' '}
            applying for{' '}
            <span className="font-semibold">
              {jd?.job_title || 'Target Role'}
            </span>
            {jd?.company_name && ` at ${jd.company_name}`}.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartInterview}
          icon={<Play className="w-4.5 h-4.5 fill-current" />}
        >
          Start Interview (Behavioral Round)
        </Button>
      </div>
      {/* Candidate Summary & Job Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Candidate CV */}
        <Card
          title="Candidate Resume Profile"
          className="border-[#CBD5E1]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <span className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
                <User className="w-4 h-4 text-[#2563EB]" />
                <span>
                  {cv?.candidate_name || 'Not specified'}
                </span>
              </span>
              <Badge variant="blue">
                {cv?.professional_level || 'Not specified'}
              </Badge>
            </div>


            {/* CV ID */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                CV ID
              </span>
              <p className="text-xs text-[#334155] mt-1">
                {cv?.cv_id || 'Not specified'}
              </p>
            </div>
            {/* Experience */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Years of Experience
              </span>
              <p className="text-xs text-[#334155] mt-1">
                {cv?.years_of_experience !== null &&
                cv?.years_of_experience !== undefined
                  ? `${cv.years_of_experience} years`
                  : 'Not specified'}
              </p>
            </div>
            {/* Education */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Education
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(cv?.education)}
              </p>
            </div>
            {/* Technical Skills */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Technical Skills
              </span>

              <div className="flex flex-wrap gap-1.5">

                {cv?.technical_skills &&
                Object.keys(cv.technical_skills).length > 0 ? (

                  Object.entries(cv.technical_skills).flatMap(
                    ([category, skills]: [string, any]) => {

                      if (Array.isArray(skills)) {

                        return skills.map((skill: any, idx: number) => (
                          <Badge
                            key={`${category}-${idx}`}
                            variant="gray"
                            size="sm"
                          >
                            {String(skill)}
                          </Badge>
                        ));

                      }

                      return (
                        <Badge
                          key={category}
                          variant="gray"
                          size="sm"
                        >
                          {`${category}: ${formatValue(skills)}`}
                        </Badge>
                      );

                    }
                  )

                ) : (

                  <span className="text-xs text-[#64748B]">
                    Not specified
                  </span>

                )}

              </div>
            </div>


            {/* Projects */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Projects
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(cv?.projects)}
              </p>
            </div>


            {/* Certifications */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Certifications
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(cv?.certifications)}
              </p>
            </div>

          </div>
        </Card>


        {/* Job Description */}
        <Card
          title="Target Role Profile"
          className="border-[#CBD5E1]"
        >
          <div className="space-y-3">

            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">

              <span className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">

                <Briefcase className="w-4 h-4 text-[#2563EB]" />

                <span>
                  {jd?.job_title || 'Not specified'}
                </span>

              </span>

              <Badge variant="gray">
                {jd?.company_name || 'Not specified'}
              </Badge>

            </div>


            {/* JD ID */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Job Description ID
              </span>

              <p className="text-xs text-[#334155] mt-1">
                {jd?.jd_id || 'Not specified'}
              </p>
            </div>


            {/* Department */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Department
              </span>

              <p className="text-xs text-[#334155] mt-1">
                {jd?.department || 'Not specified'}
              </p>
            </div>


            {/* Employment */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Employment Type
              </span>

              <p className="text-xs text-[#334155] mt-1">
                {jd?.employment_type || 'Not specified'}
              </p>
            </div>


            {/* Required Skills */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Required Technical Skills
              </span>

              <div className="flex flex-wrap gap-1.5">

                {jd?.required_technical_skills?.length ? (

                  jd.required_technical_skills.map(
                    (skill: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="blue"
                        size="sm"
                      >
                        {skill}
                      </Badge>
                    )
                  )

                ) : (

                  <span className="text-xs text-[#64748B]">
                    Not specified
                  </span>

                )}

              </div>
            </div>


            {/* Preferred Skills */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Preferred Technical Skills
              </span>

              <div className="flex flex-wrap gap-1.5">

                {jd?.preferred_technical_skills?.length ? (

                  jd.preferred_technical_skills.map(
                    (skill: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="gray"
                        size="sm"
                      >
                        {skill}
                      </Badge>
                    )
                  )

                ) : (

                  <span className="text-xs text-[#64748B]">
                    Not specified
                  </span>

                )}

              </div>
            </div>


            {/* Tools & Technologies */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Tools & Technologies
              </span>

              <div className="flex flex-wrap gap-1.5">

                {jd?.tools_and_technologies?.length ? (

                  jd.tools_and_technologies.map(
                    (tool: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="blue"
                        size="sm"
                      >
                        {tool}
                      </Badge>
                    )
                  )

                ) : (

                  <span className="text-xs text-[#64748B]">
                    Not specified
                  </span>

                )}

              </div>
            </div>


            {/* Education Requirements */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Education Requirements
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(jd?.education_requirements)}
              </p>
            </div>


            {/* Experience Requirements */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Experience Requirements
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(jd?.experience_requirements)}
              </p>
            </div>


            {/* Qualifications */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Qualifications
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(jd?.qualifications)}
              </p>
            </div>


            {/* Responsibilities */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Responsibilities
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(jd?.responsibilities)}
              </p>
            </div>


            {/* Interview Priorities */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Interview Priorities
              </span>

              <p className="text-xs text-[#334155] font-serif leading-relaxed">
                {formatValue(jd?.interview_priorities)}
              </p>
            </div>

          </div>
        </Card>

      </div>


      {/* Skill Gap Analysis */}
      <Card
        title="Competency Alignment & Skill Gap Analysis"
        className="border-[#CBD5E1]"
      >

        <div className="space-y-3">

          <p className="text-xs text-[#64748B]">
            Automated comparative analysis between the candidate's skills
            and the requirements of the target role.
          </p>


          {/* Candidate Skills */}
          <div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
              Candidate Skills
            </span>

            <div className="flex flex-wrap gap-1.5">

              {gaps[0]?.candidate_skills?.length ? (

                gaps[0].candidate_skills.map(
                  (skill: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="gray"
                      size="sm"
                    >
                      {skill}
                    </Badge>
                  )
                )

              ) : (

                <span className="text-xs text-[#64748B]">
                  Not specified
                </span>

              )}

            </div>

          </div>


          {/* Required Skills */}
          <div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
              Required Skills
            </span>

            <div className="flex flex-wrap gap-1.5">

              {gaps[0]?.required_skills?.length ? (

                gaps[0].required_skills.map(
                  (skill: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="blue"
                      size="sm"
                    >
                      {skill}
                    </Badge>
                  )
                )

              ) : (

                <span className="text-xs text-[#64748B]">
                  Not specified
                </span>

              )}

            </div>

          </div>


          {/* Individual Gap Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {gaps.length > 0 ? (

              gaps.map((item: any, idx: number) => (

                <div
                  key={idx}
                  className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs flex items-start space-x-2.5"
                >

                  <div className="mt-0.5">

                    {item.score_band === 'Matched' ? (

                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                    ) : (

                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />

                    )}

                  </div>


                  <div className="flex-1">

                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">

                      <span className="text-xs font-bold text-[#0F172A]">
                        {item.skill || 'Not specified'}
                      </span>

                      <Badge
                        variant={
                          item.score_band === 'Matched'
                            ? 'green'
                            : item.score_band === 'Partially Matched'
                              ? 'blue'
                              : 'amber'
                        }
                        size="sm"
                      >
                        {item.score_band || 'Not specified'}
                      </Badge>

                    </div>


                    <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                      {item.explanation || 'No explanation provided.'}
                    </p>

                  </div>

                </div>

              ))

            ) : (

              <p className="text-xs text-[#64748B]">
                No skill gap analysis available.
              </p>

            )}

          </div>

        </div>

      </Card>


      {/* ========================================================= */}
      {/* INTERVIEW PLANNER RESULTS */}
      {/* ========================================================= */}

      <Card
        title="Interview Planner Results"
        className="border-[#CBD5E1]"
      >

        <div className="space-y-5">

          <p className="text-xs text-[#64748B]">
            Personalized interview structure generated from the candidate
            profile, target role, and competency analysis.
          </p>


          {/* ===================================================== */}
          {/* ROUND OVERVIEW */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Behavioral */}
            <div className="p-4 bg-white border border-[#CBD5E1] rounded-xs">

              <div className="flex items-center justify-between">

                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                  Round 1
                </span>

                <Badge variant="blue">
                  {behavioral?.number_of_questions || 0} Questions
                </Badge>

              </div>

              <h3 className="text-sm font-bold text-[#0F172A] mt-1 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                <span>Behavioral</span>
              </h3>

              <p className="text-xs text-[#64748B] mt-2">
                Behavioral interview focused on the candidate's experiences,
                communication, ownership, teamwork, and problem solving.
              </p>

            </div>


            {/* Technical */}
            <div className="p-4 bg-white border border-[#CBD5E1] rounded-xs">

              <div className="flex items-center justify-between">

                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                  Round 2
                </span>

                <Badge variant="blue">
                  {technical?.number_of_questions || 0} Questions
                </Badge>

              </div>

              <h3 className="text-sm font-bold text-[#0F172A] mt-1 flex items-center space-x-1.5">
                <Code className="w-4 h-4 text-[#2563EB]" />
                <span>Technical</span>
              </h3>

              <p className="text-xs text-[#64748B] mt-2">
                Technical assessment covering the skills and concepts
                identified as relevant to the target role.
              </p>

            </div>


            {/* System Design */}
            <div className="p-4 bg-white border border-[#CBD5E1] rounded-xs">

              <div className="flex items-center justify-between">

                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                  Round 3
                </span>

                <Badge variant="blue">
                  {systemDesign?.number_of_questions || 0} Questions
                </Badge>

              </div>

              <h3 className="text-sm font-bold text-[#0F172A] mt-1 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-[#2563EB]" />
                <span>System Design</span>
              </h3>

              <p className="text-xs text-[#64748B] mt-2">
                System design assessment focused on architecture,
                scalability, reliability, and technical trade-offs.
              </p>

            </div>

          </div>


          {/* ===================================================== */}
          {/* BEHAVIORAL RESULTS */}
          {/* ===================================================== */}

          <div className="border-t border-[#E2E8F0] pt-5">

            <div className="flex items-center justify-between mb-4">

              <div>
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                  Round 1
                </span>

                <h3 className="text-sm font-bold text-[#0F172A] mt-1">
                  Behavioral Interview Plan
                </h3>
              </div>

              <Badge variant="blue">
                {behavioral?.number_of_questions || 0} Questions
              </Badge>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Topics */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Topics
                </span>

                <ListContent items={behavioral?.topics} />

              </div>


              {/* Question Objectives */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Question Objectives
                </span>

                <ListContent items={behavioral?.question_objectives} />

              </div>


              {/* Evaluation Criteria */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Evaluation Criteria
                </span>

                <ListContent items={behavioral?.evaluation_criteria} />

              </div>


              {/* Follow-up Strategy */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Follow-up Strategy
                </span>

                <p className="text-xs text-[#334155] font-serif leading-relaxed">
                  {behavioral?.follow_up_strategy || 'Not specified'}
                </p>

              </div>

            </div>

          </div>


          {/* ===================================================== */}
          {/* TECHNICAL RESULTS */}
          {/* ===================================================== */}

          <div className="border-t border-[#E2E8F0] pt-5">

            <div className="flex items-center justify-between mb-4">

              <div>
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                  Round 2
                </span>

                <h3 className="text-sm font-bold text-[#0F172A] mt-1">
                  Technical Interview Plan
                </h3>
              </div>

              <Badge variant="blue">
                {technical?.number_of_questions || 0} Questions
              </Badge>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Topics */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Topics
                </span>

                <ListContent items={technical?.topics} />

              </div>


              {/* Difficulty Progression */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Difficulty Progression
                </span>

                <ListContent items={technical?.difficulty_progression} />

              </div>


              {/* Question Objectives */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Question Objectives
                </span>

                <ListContent items={technical?.question_objectives} />

              </div>


              {/* Evaluation Criteria */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Evaluation Criteria
                </span>

                <ListContent items={technical?.evaluation_criteria} />

              </div>


              {/* Follow-up Strategy */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs md:col-span-2">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Follow-up Strategy
                </span>

                <p className="text-xs text-[#334155] font-serif leading-relaxed">
                  {technical?.follow_up_strategy || 'Not specified'}
                </p>

              </div>

            </div>

          </div>


          {/* ===================================================== */}
          {/* SYSTEM DESIGN RESULTS */}
          {/* ===================================================== */}

          <div className="border-t border-[#E2E8F0] pt-5">

            <div className="flex items-center justify-between mb-4">

              <div>
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                  Round 3
                </span>

                <h3 className="text-sm font-bold text-[#0F172A] mt-1">
                  System Design Interview Plan
                </h3>
              </div>

              <Badge variant="blue">
                {systemDesign?.number_of_questions || 0} Questions
              </Badge>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Design Topics */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Design Topics
                </span>

                <ListContent items={systemDesign?.design_topics} />

              </div>


              {/* Evaluation Criteria */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Evaluation Criteria
                </span>

                <ListContent items={systemDesign?.evaluation_criteria} />

              </div>


              {/* Expected Discussion Areas */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Expected Discussion Areas
                </span>

                <ListContent items={systemDesign?.expected_discussion_areas} />

              </div>


              {/* Follow-up Strategy */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs">

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Follow-up Strategy
                </span>

                <p className="text-xs text-[#334155] font-serif leading-relaxed">
                  {systemDesign?.follow_up_strategy || 'Not specified'}
                </p>

              </div>

            </div>

          </div>

        </div>

      </Card>


      {/* Start Button Footer */}
      <div className="flex justify-end pt-2">

        <Button
          variant="primary"
          size="lg"
          onClick={handleStartInterview}
          icon={<ArrowRight className="w-4.5 h-4.5" />}
        >
          Begin Round 1: Behavioral Interview
        </Button>

      </div>

    </div>
  );
};
