import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, target_language } = await req.json();
    if (!text || !target_language) {
      return new Response(JSON.stringify({ error: "Missing text or target_language" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a legal translation expert specializing in Indian law. Translate the following legal text from English to ${target_language}. RULES: Preserve all legal terminology accurately. Do NOT simplify or summarize — translate faithfully. Maintain paragraph structure. If a legal term has no direct translation, keep the English term in parentheses. Respond with ONLY the translated text, no explanations.\n\n${text}` }] }],
      }),
    });
    const aiData = await response.json();
    const translated_text = (aiData.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();

    return new Response(JSON.stringify({ translated_text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
