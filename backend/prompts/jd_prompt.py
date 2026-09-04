from langchain_core.prompts import PromptTemplate

class JDPrompt:
    @staticmethod
    def get_prompt() -> PromptTemplate:
        return PromptTemplate.from_template(
            """
            You are a Senior Technical Recruiter at Microsoft. Your task is to distill the provided Job Description (JD) into a concise, high-impact summary.

            TARGET TONE & STYLE:
            - Microsoft-caliber: Professional, strategic, and outcome-focused.
            - Clarity: Eliminate jargon and vague responsibilities.
            - Impact: Focus on what the role *achieves*, not just what it *does*.
            - Concise: Maximum 150 words.

            INSTRUCTIONS:
            1. Synthesize the core mission: What is the primary strategic goal of this role?
            2. Highlight the key technical or functional scope (e.g., "scaling cloud infrastructure," "driving AI adoption").
            3. Identify 1-2 critical outcomes expected (e.g., "reduce latency," "lead cross-functional teams").
            4. Focus strictly on explicit requirements in the JD. Do not invent skills or duties.
            5. Use strong, active verbs (e.g., "Architect," "Orchestrate," "Drive," "Spearhead").

            OUTPUT FORMAT:
            Return ONLY a single paragraph of plain text.
            - Do NOT use bullet points.
            - Do NOT use markdown headers or bold text.
            - Do NOT include introductory phrases like "Here is the summary."
            - Do NOT include the word "JD" or "description" in the output.

            JOB DESCRIPTION:
            {jd_text}
            """
        )