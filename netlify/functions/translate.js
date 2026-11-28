// Netlify function: translate legal text to an Indian language
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
    const { text, target_language } = req.body || {};
    if (!text || !target_language) {
      res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Missing text or target_language" }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "AI not configured" }));
      return;
    }

    const systemPrompt = `You are a legal translation expert specializing in Indian law. Translate the following legal text from English to ${target_language}. RULES: Preserve all legal terminology accurately. Do NOT simplify or summarize — translate faithfully. Maintain paragraph structure. If a legal term has no direct translation, keep the English term in parentheses. Respond with ONLY the translated text, no explanations.`;

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
    const translated_text = (geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ translated_text }));
  } catch (e) {
    console.error("translate error:", e);
    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" }).end(JSON.stringify({ error: "Service temporarily unavailable" }));
  }
};
