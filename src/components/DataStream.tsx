import { useEffect, useRef } from "react";

const codes = ["न्याय", "01001", "⚖", "LAW", "SETU", "LEGAL", "JUSTICE", "भारत", "AI", "0x4F", "§302", "IPC", "CrPC"];

const DataStream = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const el = document.createElement("div");
      el.className = "ds-line";
      el.textContent = codes[Math.floor(Math.random() * codes.length)];
      el.style.animationDuration = (Math.random() * 2 + 1) + "s";
      el.style.animationDelay = (Math.random() * 0.5) + "s";
      container.insertBefore(el, container.firstChild);
      if (container.children.length > 14) {
        container.removeChild(container.lastChild!);
      }
    }, 550);

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="data-stream" />;
};

export default DataStream;
