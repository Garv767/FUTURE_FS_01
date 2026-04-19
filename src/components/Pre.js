import React, { useEffect, useRef } from "react";

function Pre({ load }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    if (!load) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols   = Math.floor(canvas.width / 14);
    const drops  = Array(cols).fill(1);
    const chars  = "アイウエオカキクケコサ01アABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = "12px JetBrains Mono, monospace";
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = i % 5 === 0 ? "#ffffff" : "#00ff41";
        ctx.fillText(ch, i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    animRef.current = setInterval(draw, 35);
    return () => clearInterval(animRef.current);
  }, [load]);

  if (!load) return null;

  return (
    <div id="preloader" style={{
      position: "fixed", inset: 0, zIndex: 999999,
      background: "#000", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "left", minWidth: 320 }}>
        {[
          "> INITIALIZING SYSTEM...",
          "> LOADING CRYPTO MODULES... [OK]",
          "> AUTHENTICATING OPERATOR... [GRANTED]",
          "> BOOTING INTERFACE... [████████████] 100%",
        ].map((line, i) => (
          <p key={i} style={{
            color: i === 3 ? "#00ff41" : "rgba(0,255,65,0.6)",
            margin: "4px 0", fontSize: "0.85rem",
            animation: `fadeInUp 0.3s ease ${i * 0.28}s both`,
          }}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default Pre;
