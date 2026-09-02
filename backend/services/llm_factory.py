import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI


def get_llm(max_tokens=4096):
    temperature = float(os.getenv("LLM_TEMPERATURE", "0.1"))
    models = []

    groq_api_key = os.getenv("GROQ_API_KEY")

    if groq_api_key:
        groq = ChatGroq(
            model=os.getenv(
                "GROQ_MODEL_NAME", "deepseek-r1-distill-llama-70b"
            ),
            api_key=groq_api_key,
            temperature=temperature,
            max_tokens=max_tokens,
            reasoning_effort="low",
            max_retries=0,
        )
        models.append(groq)

    gemini_api_key = os.getenv("GEMINI_API_KEY")

    if gemini_api_key:
        gemini = ChatGoogleGenerativeAI(
            model=os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash"),
            google_api_key=gemini_api_key,
            temperature=temperature,
            max_output_tokens=max_tokens,
        )
        models.append(gemini)

    openai_api_key = os.getenv("OPENAI_API_KEY")
    if openai_api_key:
        openai = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL_NAME", "openrouter/free"),
            api_key=openai_api_key,
            base_url=os.getenv("OPENAI_API_BASE"),
            temperature=temperature,
            max_completion_tokens=max_tokens,
            extra_body={
                "reasoning": {
                    "max_tokens": 1024  # Capping tokens directly prevents runaway thinking loops
                }
            },
        )
        models.append(openai)

    if not models:
        raise RuntimeError(
            "No LLM API keys configured. "
            "Set GROQ_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY."
        )

    primary = models[0]

    if len(models) > 1:
        return primary.with_fallbacks(models[1:])

    return primary