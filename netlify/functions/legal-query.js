// Netlify function: legal guidance for a citizen's issue
// Powered by Google Gemini (GEMINI_API_KEY env var)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders).end();
    return;
  }
  if (req.method !== "POST") {
    res.writeHead(405, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const { user_issue, language } = req.body || {};
    if (!user_issue || !language) {
      res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Missing user_issue or language" }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "AI not configured" }));
      return;
    }

    const systemPrompt = `You are an Indian legal information assistant. A citizen has described their issue. Provide legal guidance in ${language} language. Respond in ONLY valid JSON format: {"case_category": "Type of legal case", "recommended_lawyer_types": [{"type": "Lawyer type name", "why": "Brief reason why this type of lawyer is relevant to the case", "what_they_do": "What this lawyer specializes in"}], "relevant_constitutional_articles": ["Article X"], "relevant_acts": ["Act Name"], "action_checklist": ["Step 1", "Step 2"], "disclaimer": "This is AI-generated legal information and not a substitute for a licensed advocate. Please consult a qualified lawyer for legal advice."}. IMPORTANT: recommended_lawyer_types must contain 2-4 lawyer categories ranked by relevance.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${user_issue}` }] }],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, errText);
      res.writeHead(502, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Unable to process request" }));
      return;
    }

    const geminiData = await geminiRes.json();
    const content = (geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();

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

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify(parsed));
  } catch (e) {
    console.error("legal-query error:", e);
    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Service temporarily unavailable" }));
  }
};
