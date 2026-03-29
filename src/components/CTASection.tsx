const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-bg" />
      <div className="cta-border">
        <div className="cta-corner tl" />
        <div className="cta-corner tr" />
        <div className="cta-corner bl" />
        <div className="cta-corner br" />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="section-tag" style={{ justifyContent: "center", marginBottom: 20 }}>Access Justice</div>
        <h2 className="section-title" style={{ textAlign: "center" }}>
          Justice Should Be<br />Within Everyone's Reach
        </h2>
        <p className="cta-sub">
          Experience the future of legal accessibility. Built for Bharat to empower every citizen.
        </p>
        <div className="hero-btns">
          <button className="btn-primary">
            <span style={{ position: "relative", zIndex: 1 }}>Start Free Consultation</span>
          </button>
          <button className="btn-secondary">Download the App</button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
