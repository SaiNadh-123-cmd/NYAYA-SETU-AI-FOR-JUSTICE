const techItems = [
  "Indic Legal LLM — trained on IPC, CrPC, CPC & 28 state laws",
  "Real-time eCourts API integration across 25,000+ courts",
  "End-to-end encrypted document vault with blockchain timestamping",
  "Multilingual NLP supporting 22 scheduled languages",
  "Bar Council of India compliant legal network",
];

const TechSection = () => {
  return (
    <section id="technology" className="tech-section">
      <div className="tech-visual">
        <div className="tech-ring tr1"><div className="ring-dot rd-gold" /></div>
        <div className="tech-ring tr2"><div className="ring-dot rd-cyan" /></div>
        <div className="tech-ring tr3"><div className="ring-dot rd-gold" /></div>
        <div className="tech-core">⚖️</div>

        <div className="orbit-node" style={{ top: "calc(50% - 168px)", left: "calc(50% - 18px)" }}>🤖</div>
        <div className="orbit-node" style={{ top: "calc(50% - 18px)", right: "calc(50% - 168px)" }}>🔒</div>
        <div className="orbit-node" style={{ bottom: "calc(50% - 168px)", left: "calc(50% - 18px)" }}>📡</div>
        <div className="orbit-node" style={{ top: "calc(50% - 18px)", left: "calc(50% - 168px)" }}>⚡</div>
      </div>

      <div className="tech-content">
        <div className="section-tag">Technology Stack</div>
        <h2 className="section-title">Built on the<br />Future of Law</h2>
        <p style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: "15px" }}>
          Nyaya SETU LegalEase runs on a proprietary legal AI trained on 70+ years of Indian judicial data,
          integrated with real-time court APIs and secured by enterprise-grade encryption.
        </p>
        <ul className="tech-list">
          {techItems.map((item, i) => (
            <li key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="li-dot" style={{ animationDelay: `${-i * 0.5}s` }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TechSection;
