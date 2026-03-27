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
    <section
      id="how-it-works"
      className="relative z-10 px-4 py-20 "
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(108,99,255,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge mb-4 inline-flex">
            <span>🔄</span> Simple Process
          </div>

          <h2 className="font-[Space_Grotesk] text-[clamp(28px,5vw,44px)] font-bold text-[var(--text-primary)]">
            Three steps to perfection
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(26,26,40,0.6)] p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(108,99,255,0.5)]"
            >
              {/* Watermark number */}
              <div className="absolute -top-2 right-5 font-[Space_Grotesk] text-[80px] font-bold text-[rgba(108,99,255,0.06)] leading-none select-none pointer-events-none">
                {step.num}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 border border-[rgba(108,99,255,0.3)] bg-gradient-to-br from-[rgba(108,99,255,0.2)] to-[rgba(0,212,170,0.1)]">
                {step.icon}
              </div>

              {/* Step badge */}
              <div className="inline-flex bg-[rgba(108,99,255,0.15)] text-[var(--accent-light)] rounded-md px-2.5 py-1 text-xs font-bold tracking-wide mb-3">
                STEP {step.num}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}