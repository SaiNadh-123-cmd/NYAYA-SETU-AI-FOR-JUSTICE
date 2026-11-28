import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a legal document simplifier for Indian citizens. Summarize the following legal text for a citizen with an 8th-grade reading level. Respond in ONLY valid JSON format: {"simple_summary": "A plain-language summary in 3-5 sentences", "key_points": ["Point 1", "Point 2", "Point 3"], "citizen_impact": "How this affects ordinary citizens in 2-3 sentences"}\n\n${text}` }] }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Unable to process request" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = (aiData.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();

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
        simple_summary: content,
        key_points: [],
        citizen_impact: "Could not parse structured response.",
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("summarize error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
