"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Is BgEraser completely free?",
    a: "Yes, BgEraser is 100% free with no hidden fees, credits, or subscription required. You can remove as many backgrounds as you want.",
  },
  {
    q: "Are my images uploaded to a server?",
    a: "No. All processing happens entirely in your browser using WebAssembly technology. Your images never leave your device, ensuring complete privacy.",
  },
  {
    q: "What image formats are supported?",
    a: "BgEraser supports JPG/JPEG, PNG, and WebP images up to 20MB. The output is always a high-quality transparent PNG.",
  },
  {
    q: "How long does it take?",
    a: "The first time you use BgEraser, the AI model needs to load (this takes about 5-15 seconds depending on your connection). After that, each image takes just a few seconds to process.",
  },
  {
    q: "What kind of images work best?",
    a: "BgEraser works best with images that have a clear subject — people, products, animals, and objects. It handles complex edges like hair and fur particularly well.",
  },
  {
    q: "Can I use this for commercial projects?",
    a: "Yes! The output images are yours to use however you like, including for commercial purposes. The tool itself is free for any use.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: "80px 24px 120px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="badge" style={{ marginBottom: "16px" }}>
            <span>💬</span> FAQ
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}>
            Common questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "rgba(26,26,40,0.6)",
                border: "1px solid",
                borderColor: open === i ? "var(--accent)" : "var(--border)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                boxShadow: open === i ? "0 0 20px var(--accent-glow)" : "none",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  background: "none",
                  border: "none",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "15px",
                  fontWeight: 600,
                  gap: "16px",
                }}
              >
                <span>{faq.q}</span>
                <span style={{
                  flexShrink: 0,
                  width: "28px", height: "28px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px",
                  color: "var(--accent-light)",
                  transition: "transform 0.3s ease",
                  transform: open === i ? "rotate(45deg)" : "none",
                }}>+</span>
              </button>

              <div style={{
                maxHeight: open === i ? "300px" : 0,
                overflow: "hidden",
                transition: "max-height 0.35s ease",
              }}>
                <p style={{
                  padding: "0 24px 20px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.8,
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
