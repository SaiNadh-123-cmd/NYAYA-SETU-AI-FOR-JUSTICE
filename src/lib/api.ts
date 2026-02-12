const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface TranslateRequest {
  text: string;
  target_language: string;
}

export interface TranslateResponse {
  translated_text: string;
}

export interface SummarizeRequest {
  text: string;
}

export interface SummarizeResponse {
  simple_summary: string;
  key_points: string[];
  citizen_impact: string;
}

export interface LegalQueryRequest {
  user_issue: string;
  language: string;
}

export interface LegalQueryResponse {
  case_category: string;
  recommended_lawyer_type: string;
  relevant_constitutional_articles: string[];
  relevant_acts: string[];
  action_checklist: string[];
  disclaimer: string;
}

async function apiCall<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `API error: ${res.status}`);
  }
  return res.json();
}

export async function translateText(data: TranslateRequest): Promise<TranslateResponse> {
  return apiCall("/translate", data);
}

export async function summarizeText(data: SummarizeRequest): Promise<SummarizeResponse> {
  return apiCall("/summarize", data);
}

export async function legalQuery(data: LegalQueryRequest): Promise<LegalQueryResponse> {
  return apiCall("/legal-query", data);
}

export async function uploadPdf(file: File): Promise<{ extracted_text: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/upload-pdf`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || `Upload error: ${res.status}`);
  }
  return res.json();
}

export const SUPPORTED_LANGUAGES = [
  { value: "hindi", label: "हिन्दी (Hindi)" },
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "bengali", label: "বাংলা (Bengali)" },
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "telugu", label: "తెలుగు (Telugu)" },
  { value: "kannada", label: "ಕನ್ನಡ (Kannada)" },
  { value: "gujarati", label: "ગુજરાતી (Gujarati)" },
  { value: "malayalam", label: "മലയാളം (Malayalam)" },
  { value: "punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { value: "odia", label: "ଓଡ଼ିଆ (Odia)" },
];
