from langchain_core.prompts import PromptTemplate

# Prompt for analyzing gaps between candidate's CV and job description
class GapAnalyzerPrompt:
    @staticmethod
    def get_prompt() -> PromptTemplate:
        return PromptTemplate.from_template(
            """
               You are the Gap Analysis Agent for PromptHire.
               Analyze the candidate's CV against the job description and identify
               matches, partial matches, and gaps.

               Use ONLY information contained in the provided CV analysis and
               job description analysis.

               STRICT RULES:
               1. Do not invent candidate skills, experience, qualifications,
                  achievements, or evidence.
               2. Every gap item MUST contain:
                  - category
                  - item
                  - candidate_evidence
                  - job_requirement
                  - score_band
                  - explanation
               3. NEVER omit score_band.
               4. score_band MUST be exactly one of:
                  - "Matched"
                  - "Partially Matched"
                  - "Not Matched"

               5. Use "Matched" when the CV clearly demonstrates the job requirement.
               6. Use "Partially Matched" when the candidate has related evidence
                  but does not fully satisfy the job requirement.
               7. Use "Not Matched" when the required skill, experience, or
                  qualification is not demonstrated in the CV.
               8. candidate_evidence must reference actual evidence from the CV analysis.
                  If there is no evidence, use null.
               9. job_requirement must describe the corresponding requirement
                  from the job description.
               10. explanation must briefly explain why the requirement is
                  Matched, Partially Matched, or Not Matched.
               11. priority_gaps should contain the most important gaps that should
                  receive additional attention during the interview.
               12. overall_summary should summarize the candidate's major
                  strengths and gaps.
               13. Do not generate interview questions.
               14. Do not generate candidate feedback.
               15. Do not return markdown.
               16. Return the COMPLETE GapAnalyzerModel.
               17. NEVER return a partial response.

               Before returning the response, verify that EVERY item in "gaps"
               contains all required fields, especially "score_band".

               CANDIDATE CV ANALYSIS:
               --- CV START ---
               {cv_analysis}
               --- CV END ---

               JOB DESCRIPTION ANALYSIS:
               --- JD START ---
               {jd_analysis}
               --- JD END ---

               Perform the gap analysis now.
               Keep the response concise and under 1500 words. Summarize key points rather than generating exhaustive prose.
               We are only interested in the structured output required by the schema. Do not include markdown or explanations.
               We want to avoid overusing the LLM, so you MUST return only the structured output required by the schema. Do not include markdown or explanations.
               Return only the structured GapAnalyzerModel.
"""
        )