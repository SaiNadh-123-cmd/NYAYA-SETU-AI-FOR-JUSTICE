import { useRef, useState } from "react";
import { Languages, FileText, HelpCircle } from "lucide-react";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import CustomCursor from "@/components/CustomCursor";
import OrbField from "@/components/OrbField";
import DataStream from "@/components/DataStream";
import ScrollIndicator from "@/components/ScrollIndicator";
import AnimatedNav from "@/components/AnimatedNav";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import MarqueeSection from "@/components/MarqueeSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import TechSection from "@/components/TechSection";
import CTASection from "@/components/CTASection";
import AnimatedFooter from "@/components/AnimatedFooter";
import TranslatePanel from "@/components/TranslatePanel";
import SummarizePanel from "@/components/SummarizePanel";
import LegalQueryPanel from "@/components/LegalQueryPanel";
import HistoryPanel from "@/components/HistoryPanel";
import { useAuth } from "@/contexts/AuthContext";

const baseTabs = [
  { id: "translate", label: "Translate", icon: Languages },
  { id: "summarize", label: "Simplify", icon: FileText },
  { id: "legal-query", label: "Legal Guidance", icon: HelpCircle },
] as const;

type BaseTabId = (typeof baseTabs)[number]["id"];
type TabId = BaseTabId | "history";

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("translate");
  const toolsRef = useRef<HTMLDivElement>(null);

  const tabs = user 
    ? [...baseTabs, { id: "history" as TabId, label: "Saved Context", icon: HelpCircle }] // Could use History icon here if we imported it in Index
    : baseTabs;

  const scrollToTools = () => {
    toolsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="nyaya-app">
      {/* Global animated layers */}
      <BackgroundCanvas />
      <CustomCursor />
      <OrbField />
      <DataStream />
      <ScrollIndicator />

      {/* Nav */}
      <AnimatedNav />

      {/* Hero */}
      <HeroSection onScrollToTools={scrollToTools} />

      {/* Stats */}
      <StatsBar />

      {/* Marquee */}
      <MarqueeSection />

      {/* Services */}
      <ServicesSection />

      {/* Process */}
      <ProcessSection />

      {/* Tech */}
      <TechSection />

      {/* ─── AI Tools Panel ─── */}
      <section id="tools" ref={toolsRef} className="section tools-section">
        <div className="section-tag">AI Tools</div>
        <h2 className="section-title">Powerful Legal<br />Intelligence</h2>

        <div className="tools-container">
          <div className="tools-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tool-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tool-panel-wrapper" key={activeTab}>
            <div className="tool-panel">
              {activeTab === "translate" && <TranslatePanel />}
              {activeTab === "summarize" && <SummarizePanel />}
              {activeTab === "legal-query" && <LegalQueryPanel />}
              {activeTab === "history" && user && <HistoryPanel />}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <AnimatedFooter />
    </div>
  );
};

export default Index;
