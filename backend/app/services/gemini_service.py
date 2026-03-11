import google.generativeai as genai
import os
from fastapi import HTTPException

def get_gemini_summary(data_string: str) -> str:
    """Send sales data to Gemini and get a professional narrative summary."""
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key not configured.")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
You are a senior business analyst preparing an executive briefing for a sales leadership team.

Analyze the following sales data and produce a professional, concise narrative summary (3-5 paragraphs).

Your summary must include:
1. **Overall Performance Overview** - Total revenue, units sold, and top-performing categories.
2. **Regional Breakdown** - Which regions performed best and which need attention.
3. **Trends & Observations** - Notable patterns (e.g., cancellations, high-value orders).
4. **Key Recommendations** - 2-3 actionable insights for leadership.

Keep the tone professional, data-driven, and suitable for a C-suite audience.
Do NOT use bullet points — write in flowing narrative paragraphs only.

Sales Data:
{data_string}
"""
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini API error: {str(e)}"
        )