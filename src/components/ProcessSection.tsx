const steps = [
  { num: "01", title: "Describe Issue", desc: "Tell us your legal concern in plain language — Hindi, Telugu, Tamil, or any Indian language.", color: "gold" },
  { num: "02", title: "AI Analysis", desc: "Our AI maps your situation to relevant laws, precedents, and optimal resolution paths.", color: "cyan" },
  { num: "03", title: "Get Guidance", desc: "Receive a personalized action plan with documents, expert recommendations, and next steps.", color: "gold" },
  { num: "04", title: "Achieve Justice", desc: "Track progress, stay informed, and achieve resolution with continuous AI-powered support.", color: "cyan" },
];

const ProcessSection = () => {
  return (
    <section id="process" className="process-section">
      <div className="process-line" />
      <div className="section-tag">How It Works</div>
      <h2 className="section-title">Your Path to Justice</h2>

      <div className="steps-row">
        {steps.map((s, i) => (
          <div key={i} className={`step-item step-item-${i + 1}`}>
            <div className="step-num-wrap">
              <div className={`step-orbit step-orbit-${i + 1}`}>
                <div className={`ring-dot rd-${s.color}`} />
              </div>
              <span className="step-num">{s.num}</span>
            </div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
