"use client";
export default function Features() {
  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Accuracy",
      desc: "Advanced deep learning models trained on millions of images deliver pixel-perfect cutouts — even for hair, fur, and complex edges.",
      gradient: "rgba(108,99,255,0.15)",
    },
    {
      icon: "🔒",
      title: "100% Private",
      desc: "Your images never leave your device. The AI model runs entirely in your browser using WebAssembly — zero server uploads.",
      gradient: "rgba(0,212,170,0.15)",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      desc: "Once the model loads, processing takes seconds. No queues, no waiting — instant results whenever you need them.",
      gradient: "rgba(255,107,107,0.15)",
    },
    {
      icon: "🎨",
      title: "Perfect for Designers",
      desc: "Export clean PNGs with transparent backgrounds ready for Figma, Photoshop, Canva, or any creative tool.",
      gradient: "rgba(255,200,0,0.1)",
    },
    {
      icon: "📦",
      title: "No Installation",
      desc: "Works instantly in any modern browser. No plugins, no extensions, no apps to install — just open and go.",
      gradient: "rgba(108,99,255,0.1)",
    },
    {
      icon: "♾️",
      title: "Unlimited Usage",
      desc: "No credits, no limits, no subscriptions. Remove as many backgrounds as you need, completely free forever.",
      gradient: "rgba(0,212,170,0.1)",
    },
  ];

  return (
    <section id="features" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="badge" style={{ marginBottom: "16px" }}>
            <span>⚡</span> Why BgEraser?
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}>
            Everything you need,<br />
            <span className="shimmer-text">nothing you don&apos;t</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "17px", maxWidth: "500px", margin: "0 auto" }}>
            Professional-grade background removal that respects your privacy and works offline.
          </p>
        </div>

        {/* Features grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="feature-icon"
                style={{ background: f.gradient, border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
