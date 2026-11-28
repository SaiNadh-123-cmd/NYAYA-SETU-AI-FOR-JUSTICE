// Netlify function: simplify legal text for an 8th-grade reading level
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
    const { text } = req.body || {};
    if (!text) {
      res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Missing text" }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "AI not configured" }));
      return;
    }

    const systemPrompt = `You are a legal document simplifier for Indian citizens. Summarize the following legal text for a citizen with an 8th-grade reading level. Respond in ONLY valid JSON format: {"simple_summary": "A plain-language summary in 3-5 sentences", "key_points": ["Point 1", "Point 2", "Point 3"], "citizen_impact": "How this affects ordinary citizens in 2-3 sentences"}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${text}` }] }],
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
        simple_summary: content,
        key_points: [],
        citizen_impact: "Could not parse structured response.",
      };
    }

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify(parsed));
  } catch (e) {
    console.error("summarize error:", e);
    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Service temporarily unavailable" }));
  }
};
