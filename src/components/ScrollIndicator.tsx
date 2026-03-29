import { useEffect, useState } from "react";

const ScrollIndicator = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setActive(Math.floor(p * 4.99));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-indicator">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`scroll-dot ${active === i ? "active" : ""}`} />
      ))}
    </div>
  );
};

export default ScrollIndicator;
