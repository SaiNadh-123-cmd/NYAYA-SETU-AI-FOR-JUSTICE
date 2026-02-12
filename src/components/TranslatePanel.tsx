import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { translateText, SUPPORTED_LANGUAGES } from "@/lib/api";
import PdfUploader from "./PdfUploader";

const TranslatePanel = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hindi");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await translateText({ text, target_language: language });
      setResult(res.translated_text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-sm font-semibold text-foreground">Judgment Text (English)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste court judgment text here..."
            className="w-full h-48 p-4 rounded-lg border border-border bg-card text-card-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-sm font-body"
          />
          <PdfUploader onTextExtracted={(t) => setText(t)} />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-foreground">Translation</label>
          <div className="w-full h-48 p-4 rounded-lg border border-border bg-muted/50 text-foreground text-sm overflow-y-auto font-body">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Translating...
              </div>
            ) : result ? (
              result
            ) : (
              <span className="text-muted-foreground">Translation will appear here...</span>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="gradient-saffron text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Languages className="w-4 h-4" />
          Translate
        </button>
      </div>
    </div>
  );
};

export default TranslatePanel;
