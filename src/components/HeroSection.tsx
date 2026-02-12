import { Scale, FileText, Languages, HelpCircle } from "lucide-react";

interface HeroSectionProps {
  onScrollToTools: () => void;
}

const HeroSection = ({ onScrollToTools }: HeroSectionProps) => {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container relative z-10 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground/90 text-sm font-medium mb-6 border border-primary/30">
            <Scale className="w-4 h-4" />
            <span>AI-Powered Legal Access for Bharat</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold text-secondary-foreground mb-6 leading-tight">
            NyaySetu
          </h1>

          <p className="text-lg md:text-xl text-secondary-foreground/80 mb-10 font-body leading-relaxed max-w-2xl mx-auto">
            Bridging the language gap between India's legal system and its citizens.
            Translate, simplify, and understand court judgments in your language.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <button
              onClick={onScrollToTools}
              className="gradient-saffron text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: Languages, label: "Translate Judgments", desc: "10+ Indian languages" },
              { icon: FileText, label: "Simplify Legal Text", desc: "Plain language summaries" },
              { icon: HelpCircle, label: "Legal Guidance", desc: "Know your rights & next steps" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary-foreground/5 backdrop-blur-sm border border-secondary-foreground/10"
              >
                <item.icon className="w-6 h-6 text-primary" />
                <span className="font-semibold text-secondary-foreground text-sm">{item.label}</span>
                <span className="text-secondary-foreground/60 text-xs">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
