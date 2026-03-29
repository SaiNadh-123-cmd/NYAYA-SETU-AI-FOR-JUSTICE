import { useEffect, useRef } from "react";

interface HeroSectionProps {
  onScrollToTools: () => void;
}

const floatSymbols = [
  { symbol: "⚖️", left: "12%", dur: "12s", delay: "0s", dx: "20px", rot: "180deg", sc: "0.7" },
  { symbol: "🏛️", left: "28%", dur: "15s", delay: "-4s", dx: "-15px", rot: "270deg", sc: "0.9" },
  { symbol: "📜", left: "55%", dur: "10s", delay: "-8s", dx: "10px", rot: "360deg", sc: "0.6" },
  { symbol: "🔏", left: "72%", dur: "13s", delay: "-2s", dx: "-20px", rot: "90deg", sc: "0.8" },
  { symbol: "⚖️", left: "88%", dur: "16s", delay: "-6s", dx: "25px", rot: "200deg", sc: "0.75" },
  { symbol: "🏛️", left: "5%", dur: "18s", delay: "-10s", dx: "-8px", rot: "140deg", sc: "0.85" },
  { symbol: "📋", left: "42%", dur: "14s", delay: "-3s", dx: "12px", rot: "300deg", sc: "0.65" },
  { symbol: "⚡", left: "95%", dur: "11s", delay: "-7s", dx: "-18px", rot: "250deg", sc: "0.7" },
];

const HeroSection = ({ onScrollToTools }: HeroSectionProps) => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 20;
      const dy = (e.clientY / window.innerHeight - 0.5) * 20;
      const grid = heroRef.current.querySelector(".hero-grid") as HTMLElement;
      if (grid) {
        grid.style.backgroundPosition = `${dx * 0.5}px ${dy * 0.5}px`;
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      {/* Grid overlay */}
      <div className="hero-grid" />
      {/* Scan line */}
      <div className="scan-line" />

      {/* Floating legal symbols */}
      {floatSymbols.map((s, i) => (
        <div
          key={i}
          className="float-symbol"
          style={{
            left: s.left,
            bottom: 0,
            animationDuration: s.dur,
            animationDelay: s.delay,
            "--dx": s.dx,
            "--rot": s.rot,
            "--sc": s.sc,
          } as React.CSSProperties}
        >
          {s.symbol}
        </div>
      ))}

      {/* SVG Scales Art */}
      <svg className="hero-scales" viewBox="0 0 280 280" fill="none">
        <circle cx="140" cy="140" r="120" stroke="rgba(201,168,76,0.15)" strokeWidth="1" strokeDasharray="6 4" />
        <circle cx="140" cy="140" r="90" stroke="rgba(0,229,255,0.08)" strokeWidth="1" />
        <circle cx="140" cy="140" r="60" stroke="rgba(201,168,76,0.1)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="140" y1="40" x2="140" y2="240" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" />
        <line x1="140" y1="70" x2="80" y2="140" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
        <line x1="140" y1="70" x2="200" y2="140" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
        <circle cx="80" cy="155" r="20" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" fill="rgba(201,168,76,0.05)" />
        <circle cx="200" cy="145" r="20" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" fill="rgba(201,168,76,0.05)" />
        <circle cx="140" cy="60" r="6" fill="rgba(201,168,76,0.6)" />
        <circle cx="140" cy="240" r="4" fill="rgba(201,168,76,0.4)" />
      </svg>

      {/* Content */}
      <div className="hero-eyebrow">
        <span className="eyebrow-line" />
        INDIA'S PREMIER AI LEGAL PLATFORM
        <span className="eyebrow-line" />
      </div>

      <h1 className="hero-title">
        <span className="title-nyaya">NYAYA</span>
        <span className="title-setu">SETU</span>
        <span className="title-legal">LegalEase</span>
      </h1>

      <p className="hero-desc">
        Bridging the gap between citizens and justice through intelligent legal technology.
        AI-powered guidance, document automation, and expert connections — all in one ecosystem.
      </p>

      <div className="hero-btns">
        <button className="btn-primary" onClick={onScrollToTools}>
          <span style={{ position: "relative", zIndex: 1 }}>Begin Your Journey</span>
        </button>
        <button className="btn-secondary" onClick={onScrollToTools}>Explore Services ↓</button>
      </div>
    </section>
  );
};

export default HeroSection;
