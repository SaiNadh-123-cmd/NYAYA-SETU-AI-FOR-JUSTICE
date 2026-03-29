import { useEffect, useRef } from "react";

const StatsBar = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLSpanElement>(".stat-num[data-target]");
    if (!els) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLSpanElement;
            const target = +(el.dataset.target || "0");
            const dur = 2000;
            const start = Date.now();
            const step = () => {
              const p = Math.min((Date.now() - start) / dur, 1);
              const ease = 1 - Math.pow(1 - p, 4);
              el.textContent = Math.round(ease * target).toLocaleString("en-IN");
              if (p < 1) requestAnimationFrame(step);
            };
            step();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { target: 500000, label: "Case Laws Trained" },
    { target: 70, label: "Years of Precedents" },
    { target: 22, label: "Languages Supported" },
    { target: 25000, label: "Courts Integrated" },
  ];

  return (
    <div ref={sectionRef} className="stats-bar">
      {stats.map((s, i) => (
        <div key={i} className="stat-item" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
          <span className="stat-num" data-target={s.target}>0</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
