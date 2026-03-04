import { useRef, useState } from "react";
import { Languages, FileText, HelpCircle, Scale } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import TranslatePanel from "@/components/TranslatePanel";
import SummarizePanel from "@/components/SummarizePanel";
import LegalQueryPanel from "@/components/LegalQueryPanel";

const tabs = [
  { id: "translate", label: "Translate", icon: Languages },
  { id: "summarize", label: "Simplify", icon: FileText },
  { id: "legal-query", label: "Legal Guidance", icon: HelpCircle },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("translate");
  const toolsRef = useRef<HTMLDivElement>(null);

  const scrollToTools = () => {
    toolsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary text-secondary-foreground px-4 py-3">
        <div className="container flex items-center gap-3">
          <Scale className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-lg">NyaySetu</span>
          <span className="text-xs text-secondary-foreground/60 font-body ml-auto hidden sm:block">
            AI Legal Access for Bharat
          </span>
        </div>
      </header>

      <HeroSection onScrollToTools={scrollToTools} />

      <section ref={toolsRef} className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all font-body ${
                  activeTab === tab.id
                    ? "gradient-saffron text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="animate-fade-in" key={activeTab}>
            {activeTab === "translate" && <TranslatePanel />}
            {activeTab === "summarize" && <SummarizePanel />}
            {activeTab === "legal-query" && <LegalQueryPanel />}
          </div>
        </div>
      </section>

      <footer className="bg-secondary text-secondary-foreground/60 py-6 mt-8">
        <div className="container text-center text-xs font-body space-y-2">
          <p>NyaySetu — AI-powered legal information tool. Not a substitute for professional legal advice.</p>
          <p>Built for Bharat 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
