from pydantic import BaseModel
from typing import List


class TranslateRequest(BaseModel):
    text: str
    target_language: str


class TranslateResponse(BaseModel):
    translated_text: str


class SummarizeRequest(BaseModel):
    text: str


class SummarizeResponse(BaseModel):
    simple_summary: str
    key_points: List[str]
    citizen_impact: str


class LegalQueryRequest(BaseModel):
    user_issue: str
    language: str


class LegalQueryResponse(BaseModel):
    case_category: str
    recommended_lawyer_type: str
    relevant_constitutional_articles: List[str]
    relevant_acts: List[str]
    action_checklist: List[str]
    disclaimer: str


class PdfResponse(BaseModel):
    extracted_text: str
