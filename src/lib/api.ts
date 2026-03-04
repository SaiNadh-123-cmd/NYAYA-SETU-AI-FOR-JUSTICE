import { supabase } from "@/integrations/supabase/client";

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

async function edgeCall<T>(functionName: string, body: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });

  if (error) {
    throw new Error(error.message || `API error calling ${functionName}`);
  }

  return data as T;
}

export async function translateText(data: TranslateRequest): Promise<TranslateResponse> {
  return edgeCall("translate", data);
}

export async function summarizeText(data: SummarizeRequest): Promise<SummarizeResponse> {
  return edgeCall("summarize", data);
}

export async function legalQuery(data: LegalQueryRequest): Promise<LegalQueryResponse> {
  return edgeCall("legal-query", data);
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
