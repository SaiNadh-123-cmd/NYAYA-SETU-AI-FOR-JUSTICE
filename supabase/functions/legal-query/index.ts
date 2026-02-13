import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
            content: `You are an Indian legal information assistant. A citizen has described their issue. Provide legal guidance in ${language} language. Respond in ONLY valid JSON format: {"case_category": "Type of legal case", "recommended_lawyer_type": "Type of lawyer to consult", "relevant_constitutional_articles": ["Article X"], "relevant_acts": ["Act Name"], "action_checklist": ["Step 1", "Step 2"], "disclaimer": "This is AI-generated legal information and not a substitute for a licensed advocate. Please consult a qualified lawyer for legal advice."}`,
          },
          { role: "user", content: user_issue },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: `AI error: ${response.status}` }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || "";

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
        recommended_lawyer_type: "General Practice Lawyer",
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
    return new Response(JSON.stringify({ error: e.message || "Legal query failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
