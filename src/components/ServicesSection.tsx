import { useRef, useCallback } from "react";

const services = [
  { num: "01", icon: "🤖", title: "AI Legal Advisor", desc: "Instant legal guidance powered by advanced language models trained on Indian law, precedents, and statutes across all jurisdictions." },
  { num: "02", icon: "📋", title: "Document Automation", desc: "Generate legally sound contracts, petitions, affidavits, and notices in minutes. Multilingual support across 22 scheduled languages." },
  { num: "03", icon: "🔗", title: "Expert Network", desc: "Connect with verified advocates, solicitors, and legal consultants. Video consultations, secure messaging, and escrow-protected payments." },
  { num: "04", icon: "⚡", title: "Court Tracker", desc: "Real-time case status from all district, high courts, and Supreme Court. Smart alerts for hearing dates and order uploads." },
  { num: "05", icon: "🛡️", title: "Rights Protector", desc: "Know your fundamental rights instantly. Emergency legal helpline with location-aware guidance for citizens in distress." },
  { num: "06", icon: "🏛️", title: "ADR Hub", desc: "Online dispute resolution through mediation and arbitration. Faster, cost-effective justice outside traditional courtrooms." },
];

const ServicesSection = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", x + "%");
    card.style.setProperty("--my", y + "%");
  }, []);

  return (
    <section id="services" className="section">
      <div className="section-tag">Core Services</div>
      <h2 className="section-title">Legal Solutions<br />Reimagined</h2>

      <div className="services-grid">
        {services.map((s, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="service-card"
            onMouseMove={(e) => handleMouseMove(e, i)}
          >
            <div className="card-glow" />
            <div className="card-corner" />
            <div className="card-particle cp1" />
            <div className="card-particle cp2" />
            <div className="card-particle cp3" />
            <div className="card-num">{s.num}</div>
            <div className="service-icon">
              <div className="icon-ring" />
              <div className="icon-ring" style={{ animationDelay: "-1s", borderColor: "rgba(0,229,255,0.2)" }} />
              <span className="icon-glyph">{s.icon}</span>
            </div>
            <h3 className="card-title">{s.title}</h3>
            <p className="card-desc">{s.desc}</p>
            <div className="card-arrow">
              <span className="arrow-line" /> Explore
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
