"use client";
export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload Your Image",
      desc: "Drag & drop or click to select any image — JPG, PNG, or WebP up to 20MB.",
      icon: "📤",
    },
    {
      num: "02",
      title: "AI Processes It",
      desc: "Our on-device AI model analyzes the image and detects the foreground subject with precision.",
      icon: "🧠",
    },
    {
      num: "03",
      title: "Download Your PNG",
      desc: "Get a crisp PNG with a transparent background ready to use anywhere.",
      icon: "⬇️",
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
      {/* Background accent */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "300px",
        background: "radial-gradient(ellipse, rgba(108,99,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="badge" style={{ marginBottom: "16px" }}>
            <span>🔄</span> Simple Process
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}>
            Three steps to perfection
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          position: "relative",
        }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: "rgba(26,26,40,0.6)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "36px 28px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(108,99,255,0.5)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              {/* Step number watermark */}
              <div style={{
                position: "absolute", top: "-10px", right: "20px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "80px",
                fontWeight: 700,
                color: "rgba(108,99,255,0.06)",
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}>
                {step.num}
              </div>

              <div style={{
                width: "56px", height: "56px",
                background: "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,170,0.1))",
                border: "1px solid rgba(108,99,255,0.3)",
                borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px",
                marginBottom: "20px",
              }}>
                {step.icon}
              </div>

              <div style={{
                display: "inline-flex",
                background: "rgba(108,99,255,0.15)",
                color: "var(--accent-light)",
                borderRadius: "6px",
                padding: "3px 10px",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "12px",
                letterSpacing: "0.05em",
              }}>
                STEP {step.num}
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
