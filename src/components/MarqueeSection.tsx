const items = [
  "AI Legal Guidance", "Document Automation", "Court Tracking", "Expert Advocates",
  "Rights Protection", "Dispute Resolution", "24/7 Support", "All Indian Languages",
  "Bar Council Certified", "Blockchain Secured", "Multilingual NLP", "Supreme Court APIs",
];

const MarqueeSection = () => {
  const quadrupled = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-section">
      <div className="marquee-inner">
        {quadrupled.map((text, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeSection;
