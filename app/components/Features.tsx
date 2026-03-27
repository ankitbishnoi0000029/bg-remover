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
    <section
      id="features"
      className="relative z-10 px-4 sm:px-6 md:px-8 py-24"
    >
      <div className="w-full max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge mb-4 inline-flex">
            <span>⚡</span> Why BgEraser?
          </div>

          <h2 className="font-[Space_Grotesk] text-[clamp(28px,5vw,44px)] font-bold text-[var(--text-primary)] mb-4">
            Everything you need,<br />
            <span className="shimmer-text">nothing you don&apos;t</span>
          </h2>

          <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-[500px] mx-auto">
            Professional-grade background removal that respects your privacy and works offline.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card fade-in-up p-6 sm:p-7 rounded-2xl transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className="feature-icon w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-4 border border-white/10"
                style={{ background: f.gradient }}
              >
                {f.icon}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}