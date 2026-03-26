"use client";

import dynamic from "next/dynamic";
const BgRemover = dynamic(() => import("./BgRemover"), { ssr: false });
const stats = [
  { value: "100%", label: "Free Forever" },
  { value: "0", label: "Uploads" },
  { value: "∞", label: "Images" },
];

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Decorative rings */}
      <div style={{ position: "absolute", top: "15%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid rgba(108,99,255,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "20%", left: "5%", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(108,99,255,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "5%", width: "250px", height: "250px", borderRadius: "50%", border: "1px solid rgba(0,212,170,0.07)", pointerEvents: "none" }} />

      {/* Headline block */}
      <div style={{ maxWidth: "860px", width: "100%", textAlign: "center", marginBottom: "60px" }}>
        <div className="badge fade-in-up" style={{ marginBottom: "24px", display: "inline-flex" }}>
          <span style={{ color: "var(--teal)" }}>●</span>
          <span>Free · Private · No Signup Required</span>
        </div>

        <h1
          className="fade-in-up fade-in-up-delay-1"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(36px, 7vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-0.02em",
          }}
        >
          Remove backgrounds
          <br />
          <span className="shimmer-text">with one click</span>
        </h1>

        <p
          className="fade-in-up fade-in-up-delay-2"
          style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          AI-powered background removal that runs entirely in your browser.
          No uploads. No accounts. No waiting. Just instant, pixel-perfect results.
        </p>

        {/* Stats */}
        <div
          className="fade-in-up fade-in-up-delay-3"
          style={{ display: "flex", justifyContent: "center", gap: "48px", marginBottom: "48px", flexWrap: "wrap" }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--accent-light)",
                lineHeight: 1,
                marginBottom: "4px",
              }}>{value}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool card */}
      <div
        id="upload"
        className="glass-card fade-in-up fade-in-up-delay-4"
        style={{ width: "100%", maxWidth: "800px", padding: "32px" }}
      >
        {/* Card header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
        }}>
          <div style={{
            width: "42px", height: "42px",
            background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
          }}>✂</div>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
              AI Background Remover
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Powered by @imgly/background-removal · Runs locally in your browser
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(0,212,170,0.1)",
              border: "1px solid rgba(0,212,170,0.3)",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "12px",
              color: "var(--teal)",
            }}>
              <span style={{
                width: "6px", height: "6px",
                background: "var(--teal)",
                borderRadius: "50%",
                display: "inline-block",
                animation: "pulse-glow 2s ease-in-out infinite",
              }} />
              Ready
            </div>
          </div>
        </div>

        <BgRemover />
      </div>
    </section>
  );
}
