import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { summarizeText } from "@/lib/api";
import PdfUploader from "./PdfUploader";

const SummarizePanel = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    simple_summary: string;
    key_points: string[];
    citizen_impact: string;
  } | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await summarizeText({ text });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Summarization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground">Judgment Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste legal text to simplify..."
          className="w-full h-40 p-4 rounded-lg border border-border bg-card text-card-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-sm font-body"
        />
        <PdfUploader onTextExtracted={(t) => setText(t)} />
      </div>

      <button
        onClick={handleSummarize}
        disabled={loading || !text.trim()}
        className="gradient-saffron text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center gap-2 hover:shadow-lg transition-shadow"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        Simplify
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-xl gradient-card border border-border">
            <h3 className="font-heading font-bold text-lg text-foreground mb-2">Plain Language Summary</h3>
            <p className="text-sm text-foreground/80 leading-relaxed font-body">{result.simple_summary}</p>
          </div>

          <div className="p-5 rounded-xl gradient-card border border-border">
            <h3 className="font-heading font-bold text-lg text-foreground mb-3">Key Points</h3>
            <ul className="space-y-2">
              {result.key_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body">
                  <span className="w-5 h-5 rounded-full gradient-saffron text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-accent border border-primary/20">
            <h3 className="font-heading font-bold text-lg text-accent-foreground mb-2">How This Affects You</h3>
            <p className="text-sm text-accent-foreground/80 leading-relaxed font-body">{result.citizen_impact}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarizePanel;
