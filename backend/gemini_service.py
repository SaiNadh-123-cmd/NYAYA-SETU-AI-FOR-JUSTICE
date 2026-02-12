import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()


class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY environment variable is not set.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def _parse_json(self, text: str) -> dict:
        """Extract and parse JSON from model response."""
        text = text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            text = text.rsplit("```", 1)[0]
        return json.loads(text)

    def translate(self, text: str, target_language: str) -> str:
        prompt = f"""You are a legal translation expert specializing in Indian law.

Translate the following legal text from English to {target_language}.

RULES:
- Preserve all legal terminology accurately
- Do NOT simplify or summarize — translate faithfully
- Maintain paragraph structure
- If a legal term has no direct translation, keep the English term in parentheses

TEXT:
{text}

Respond with ONLY the translated text, no explanations."""

        response = self.model.generate_content(prompt)
        return response.text.strip()

    def summarize(self, text: str) -> dict:
        prompt = f"""You are a legal document simplifier for Indian citizens.

Summarize the following legal text for a citizen with an 8th-grade reading level.

TEXT:
{text}

Respond in ONLY valid JSON format:
{{
  "simple_summary": "A plain-language summary of the judgment in 3-5 sentences",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "citizen_impact": "How this judgment affects ordinary citizens in 2-3 sentences"
}}"""

        response = self.model.generate_content(prompt)
        try:
            return self._parse_json(response.text)
        except json.JSONDecodeError:
            return {
                "simple_summary": response.text.strip(),
                "key_points": [],
                "citizen_impact": "Could not parse structured response."
            }

    def legal_query(self, user_issue: str, language: str) -> dict:
        prompt = f"""You are an Indian legal information assistant. A citizen has described their issue below.

Provide legal guidance in {language} language.

USER ISSUE:
{user_issue}

Respond in ONLY valid JSON format:
{{
  "case_category": "Type of legal case (e.g., Civil, Criminal, Family, Labor, Constitutional)",
  "recommended_lawyer_type": "Type of lawyer to consult",
  "relevant_constitutional_articles": ["Article X", "Article Y"],
  "relevant_acts": ["Act Name 1", "Act Name 2"],
  "action_checklist": ["Step 1", "Step 2", "Step 3"],
  "disclaimer": "This is AI-generated legal information and not a substitute for a licensed advocate. Please consult a qualified lawyer for legal advice."
}}"""

        response = self.model.generate_content(prompt)
        try:
            return self._parse_json(response.text)
        except json.JSONDecodeError:
            return {
                "case_category": "Unknown",
                "recommended_lawyer_type": "General Practice Lawyer",
                "relevant_constitutional_articles": [],
                "relevant_acts": [],
                "action_checklist": ["Consult a licensed advocate for personalized advice."],
                "disclaimer": "This is AI-generated legal information and not a substitute for a licensed advocate."
            }
