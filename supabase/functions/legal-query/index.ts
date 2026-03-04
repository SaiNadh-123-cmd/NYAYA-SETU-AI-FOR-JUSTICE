import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { user_issue, language } = await req.json();
    if (!user_issue || !language) {
      return new Response(JSON.stringify({ error: "Missing user_issue or language" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an Indian legal information assistant. A citizen has described their issue. Provide legal guidance in ${language} language. Respond in ONLY valid JSON format: {"case_category": "Type of legal case", "recommended_lawyer_types": [{"type": "Lawyer type name", "why": "Brief reason why this type of lawyer is relevant to the case", "what_they_do": "What this lawyer specializes in"}], "relevant_constitutional_articles": ["Article X"], "relevant_acts": ["Act Name"], "action_checklist": ["Step 1", "Step 2"], "disclaimer": "This is AI-generated legal information and not a substitute for a licensed advocate. Please consult a qualified lawyer for legal advice."}. IMPORTANT: recommended_lawyer_types must contain 2-4 lawyer categories ranked by relevance.`,
          },
          { role: "user", content: user_issue },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Unable to process request" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content?.trim() || "";

    let parsed;
    try {
      let jsonStr = content;
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.split("\n").slice(1).join("\n");
        jsonStr = jsonStr.replace(/```$/, "").trim();
      }
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = {
        case_category: "Unknown",
        recommended_lawyer_types: [{ type: "General Practice Lawyer", why: "Can handle a wide range of legal issues", what_they_do: "Provides general legal advice and representation" }],
        relevant_constitutional_articles: [],
        relevant_acts: [],
        action_checklist: ["Consult a licensed advocate for personalized advice."],
        disclaimer: "This is AI-generated legal information and not a substitute for a licensed advocate.",
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("legal-query error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
