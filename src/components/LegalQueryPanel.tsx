import { useState } from "react";
import { HelpCircle, Loader2, AlertTriangle, Scale, BookOpen, ListChecks, UserCheck } from "lucide-react";
import { legalQuery, SUPPORTED_LANGUAGES, type LegalQueryResponse } from "@/lib/api";

const LegalQueryPanel = () => {
  const [issue, setIssue] = useState("");
  const [language, setLanguage] = useState("hindi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LegalQueryResponse | null>(null);

  const handleQuery = async () => {
    if (!issue.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await legalQuery({ user_issue: issue, language });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Query failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground">Describe Your Legal Issue</label>
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="e.g. My landlord is refusing to return my security deposit..."
          className="w-full h-32 p-4 rounded-lg border border-border bg-card text-card-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-sm font-body"
        />
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
          onClick={handleQuery}
          disabled={loading || !issue.trim()}
          className="gradient-saffron text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
          Get Legal Guidance
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Case Category */}
          <div className="p-5 rounded-xl gradient-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Case Category</h3>
            </div>
            <p className="text-sm text-foreground/80 font-body">{result.case_category}</p>
          </div>

          {/* Suggested Lawyer Categories */}
          <div className="p-5 rounded-xl gradient-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Suggested Lawyer Categories</h3>
            </div>
            <div className="grid gap-3">
              {result.recommended_lawyer_types?.map((lawyer, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-background border border-border/60 flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-full gradient-saffron text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="font-heading font-bold text-sm text-foreground">{lawyer.type}</p>
                    <p className="text-xs text-muted-foreground font-body">{lawyer.what_they_do}</p>
                    <p className="text-xs text-primary font-body italic">Why: {lawyer.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Laws */}
          <div className="p-5 rounded-xl gradient-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Relevant Laws</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Constitutional Articles</p>
                <div className="flex flex-wrap gap-2">
                  {result.relevant_constitutional_articles.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Relevant Acts</p>
                <div className="flex flex-wrap gap-2">
                  {result.relevant_acts.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="p-5 rounded-xl gradient-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Action Checklist</h3>
            </div>
            <ul className="space-y-2">
              {result.action_checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 font-body">
                  <span className="w-5 h-5 rounded-md gradient-saffron text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/70 font-body italic">{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalQueryPanel;
