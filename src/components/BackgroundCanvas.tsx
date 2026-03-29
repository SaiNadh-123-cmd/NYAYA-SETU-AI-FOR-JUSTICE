import { useEffect, useRef } from "react";

const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ─── Particle ───
    class Particle {
      x = 0; y = 0; size = 0; speedY = 0; speedX = 0;
      color = ""; opacity = 0; twinkle = 0;

      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x = Math.random() * canvas!.width;
        this.y = initial ? Math.random() * canvas!.height : canvas!.height + 10;
        this.size = Math.random() * 2 + 0.3;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.twinkle = Math.random() * Math.PI * 2;
        const r = Math.random();
        this.color = r > 0.6 ? "#c9a84c" : r > 0.3 ? "#00e5ff" : "#ffffff";
        this.opacity = Math.random() * 0.5 + 0.15;
      }

      update() {
        this.x += this.speedX + Math.sin(this.twinkle) * 0.1;
        this.y += this.speedY;
        this.twinkle += 0.03;
        if (this.y < -10) this.reset();
      }

      draw(ctx: CanvasRenderingContext2D) {
        const t = Math.sin(this.twinkle) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = this.opacity * t;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 5;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ─── Rising Line ───
    class LineParticle {
      x = 0; y = 0; len = 0; speed = 0; opacity = 0; color = "";

      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + 5;
        this.len = Math.random() * 80 + 20;
        this.speed = Math.random() * 0.8 + 0.3;
        this.opacity = Math.random() * 0.12 + 0.04;
        this.color = Math.random() > 0.5 ? "rgba(201,168,76," : "rgba(0,229,255,";
      }

      update() {
        this.y -= this.speed;
        if (this.y < -this.len) this.reset();
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.len);
        grad.addColorStop(0, this.color + "0)");
        grad.addColorStop(0.5, this.color + this.opacity + ")");
        grad.addColorStop(1, this.color + "0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.len);
        ctx.stroke();
        ctx.restore();
      }
    }

    // ─── Shooting Star ───
    class ShootingStar {
      x = 0; y = 0; vx = 0; vy = 0; life = 0; maxLen = 0; timer = 0;

      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height * 0.5;
        this.vx = Math.random() * 4 + 2;
        this.vy = Math.random() * 2 + 1;
        this.life = 1;
        this.maxLen = Math.random() * 80 + 30;
        this.timer = Math.random() * 300 + 100;
      }

      update() {
        this.timer--;
        if (this.timer > 0) return;
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
        if (this.life <= 0 || this.x > canvas!.width || this.y > canvas!.height) this.reset();
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.timer > 0) return;
        ctx.save();
        ctx.globalAlpha = this.life * 0.6;
        const grad = ctx.createLinearGradient(
          this.x, this.y,
          this.x - this.vx * this.maxLen / 5,
          this.y - this.vy * this.maxLen / 5
        );
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(0.5, "rgba(201,168,76,0.4)");
        grad.addColorStop(1, "rgba(201,168,76,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * this.maxLen / 5, this.y - this.vy * this.maxLen / 5);
        ctx.stroke();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 110 }, () => new Particle());
    const lines = Array.from({ length: 28 }, () => new LineParticle());
    const stars = Array.from({ length: 8 }, () => new ShootingStar());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(l => { l.update(); l.draw(ctx); });
      particles.forEach(p => { p.update(); p.draw(ctx); });
      stars.forEach(s => { s.update(); s.draw(ctx); });
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default BackgroundCanvas;
