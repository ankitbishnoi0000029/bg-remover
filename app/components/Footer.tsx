"use client";
export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "40px 24px",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px",
            background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>✂</div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}>
            Bg<span style={{ color: "#6c63ff" }}>Eraser</span>
          </span>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
          © {new Date().getFullYear()} BgEraser · Free AI Background Removal · No uploads, no tracking
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy", "Terms", "GitHub"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
