const API_BASE = import.meta.env.VITE_API_URL || "";

async function apiCall<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/.netlify/functions/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `API error calling ${path}`);
  }

  return res.json() as Promise<T>;
}

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

export interface LawyerType {
  type: string;
  why: string;
  what_they_do: string;
}

export interface LegalQueryResponse {
  case_category: string;
  recommended_lawyer_types: LawyerType[];
  relevant_constitutional_articles: string[];
  relevant_acts: string[];
  action_checklist: string[];
  disclaimer: string;
}

export async function translateText(data: TranslateRequest): Promise<TranslateResponse> {
  return apiCall("translate", data);
}

export async function summarizeText(data: SummarizeRequest): Promise<SummarizeResponse> {
  return apiCall("summarize", data);
}

export async function legalQuery(data: LegalQueryRequest): Promise<LegalQueryResponse> {
  return apiCall("legal-query", data);
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

interface SavedQueryInsert {
  user_id: string;
  type: "translate" | "summarize" | "query";
  input_text: string;
  result_data: unknown;
}

export async function saveHistory(
  userId: string,
  type: 'translate' | 'summarize' | 'query',
  inputText: string,
  resultData: unknown
) {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("saved_queries").insert({
      user_id: userId,
      type,
      input_text: inputText,
      result_data: resultData,
    } as SavedQueryInsert);

    if (error) {
      console.error("Error saving history:", error);
    }
  } catch {
    // History is optional; never block the AI tools if Supabase is unavailable.
  }
}
