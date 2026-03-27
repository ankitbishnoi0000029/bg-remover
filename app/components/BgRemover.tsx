"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type ProcessingState = "idle" | "loading" | "processing" | "done" | "error";

interface ProcessingLog {
  message: string;
  type: "info" | "success" | "error";
}

export default function BgRemover() {
  const [state, setState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState(0);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [originalSize, setOriginalSize] = useState<{ w: number; h: number } | null>(null);
  const [view, setView] = useState<"compare" | "result" | "original">("compare");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  const addLog = (message: string, type: ProcessingLog["type"] = "info") => {
    setLogs((prev) => [...prev, { message, type }]);
  };

  const processFile = useCallback(async (file: File) => {
    if (processingRef.current) return;
    if (!file.type.startsWith("image/")) {
      addLog("Please upload a valid image file (JPG, PNG, WebP)", "error");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      addLog("File too large. Max size is 20MB.", "error");
      return;
    }

    processingRef.current = true;
    setLogs([]);
    setResultUrl(null);
    setProgress(0);
    setState("loading");
    setFileName(file.name);

    // Set original preview
    const originalObjectUrl = URL.createObjectURL(file);
    setOriginalUrl(originalObjectUrl);

    // Get image dimensions
    const img = new Image();
    img.onload = () => setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = originalObjectUrl;

    addLog("Loading AI model...", "info");

    try {
      setState("processing");

      const { removeBackground } = await import("@imgly/background-removal");

      addLog("AI model ready. Processing image...", "info");
      setProgress(20);
const publicPath = `${window.location.origin}/imgly-assets/`;
      const blob = await removeBackground(file, {
        publicPath,
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            setProgress(Math.min(20 + pct * 0.7, 90));
            if (key.includes("fetch") && pct === 0) {
              addLog(`Loading resource: ${key.split("/").pop()}`, "info");
            }
          }
        },
      });

      setProgress(95);
      addLog("Finalizing output...", "info");

      const resultObjectUrl = URL.createObjectURL(blob);
      setResultUrl(resultObjectUrl);
      setProgress(100);
      setState("done");
      setView("compare");
      addLog("Background removed successfully!", "success");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      addLog(`Error: ${msg}`, "error");
      setState("error");
    } finally {
      processingRef.current = false;
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `bgeraser_${fileName.replace(/\.[^.]+$/, "")}.png`;
    a.click();
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalUrl(null);
    setResultUrl(null);
    setState("idle");
    setProgress(0);
    setLogs([]);
    setSliderPos(50);
    setOriginalSize(null);
    setFileName("");
  };

  // Comparison slider mouse events
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !comparisonRef.current) return;
    const rect = comparisonRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, [dragging]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging || !comparisonRef.current) return;
    const rect = comparisonRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, [dragging]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setDragging(false));
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", () => setDragging(false));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => setDragging(false));
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", () => setDragging(false));
    };
  }, [dragging, handleMouseMove, handleTouchMove]);

  const isProcessing = state === "loading" || state === "processing";

  return (
    <div id="upload" style={{ position: "relative", zIndex: 1 }}>
      {/* Upload / Drop Zone */}
      {state === "idle" && (
        <div
          className={`drop-zone fade-in-up ${dragOver ? "drag-over" : ""}`}
          style={{
            padding: "60px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {/* Decorative orbs */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "120px", height: "120px",
            background: "radial-gradient(circle, rgba(108,99,255,0.2), transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-30px", left: "-30px",
            width: "100px", height: "100px",
            background: "radial-gradient(circle, rgba(0,212,170,0.15), transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />

          <div style={{
            // width: "80px", height: "80px",
            background: "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,170,0.1))",
            border: "2px solid rgba(108,99,255,0.3)",
            borderRadius: "24px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "36px",
          }}>
            🖼️
          </div>

          <h2 className="drop" style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
            Drop your image here
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "24px" }}>
            or click to browse — PNG, JPG, WebP up to 20MB
          </p>

          <button
            className="btn-primary button-img"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            <span>📂 Choose Image</span>
          </button>

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            {["No signup needed", "100% free", "Runs in browser", "Privacy safe"].map((t) => (
              <span key={t} style={{
                display: "flex", alignItems: "center", gap: "6px",
                color: "var(--text-secondary)", fontSize: "13px",
              }}>
                <span style={{ color: "var(--teal)" }}>✓</span> {t}
              </span>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="glass-card fade-in-up" style={{ padding: "48px 40px", textAlign: "center" }}>
          {/* Spinning loader */}
          <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 32px" }}>
            <div style={{
              position: "absolute", inset: 0,
              border: "3px solid rgba(108,99,255,0.2)",
              borderRadius: "50%",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              border: "3px solid transparent",
              borderTopColor: "var(--accent)",
              borderRightColor: "var(--teal)",
              borderRadius: "50%",
              animation: "spin-slow 1.2s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: "8px",
              border: "2px solid transparent",
              borderTopColor: "var(--teal)",
              borderRadius: "50%",
              animation: "spin-slow 0.8s linear infinite reverse",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
            }}>✂</div>
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
            {state === "loading" ? "Initializing AI..." : "Removing Background..."}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "28px" }}>
            AI model is processing your image. This may take 10-30 seconds.
          </p>

          {/* Progress bar */}
          <div className="progress-bar" style={{ marginBottom: "12px" }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p style={{ color: "var(--accent-light)", fontSize: "13px", fontWeight: 600 }}>{progress}%</p>

          {/* Logs */}
          {logs.length > 0 && (
            <div style={{
              marginTop: "24px",
              background: "rgba(10,10,15,0.6)",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "left",
              maxHeight: "120px",
              overflowY: "auto",
            }}>
              {logs.map((log, i) => (
                <div key={i} style={{
                  display: "flex", gap: "8px", alignItems: "flex-start",
                  color: log.type === "error" ? "#ff6b6b" : log.type === "success" ? "var(--teal)" : "var(--text-secondary)",
                  fontSize: "12px",
                  marginBottom: "4px",
                  fontFamily: "monospace",
                }}>
                  <span>{log.type === "error" ? "✖" : log.type === "success" ? "✔" : "›"}</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result State */}
      {state === "done" && originalUrl && resultUrl && (
        <div className="fade-in-up">
          {/* View toggle */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", justifyContent: "center" }}>
            {(["compare", "original", "result"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  border: "1px solid",
                  borderColor: view === v ? "var(--accent)" : "var(--border)",
                  background: view === v ? "rgba(108,99,255,0.2)" : "transparent",
                  color: view === v ? "var(--accent-light)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {v === "compare" ? "⇄ Compare" : v === "original" ? "Original" : "✨ Result"}
              </button>
            ))}
          </div>

          {/* Image display */}
          <div className="glass-card" style={{ overflow: "hidden", marginBottom: "20px" }}>
            {view === "compare" && (
              <div
                ref={comparisonRef}
                className="comparison-container"
                style={{ width: "100%", aspectRatio: "16/9", maxHeight: "500px", position: "relative" }}
                onMouseDown={() => setDragging(true)}
                onTouchStart={() => setDragging(true)}
              >
                {/* Original image (right side) */}
                <div style={{ position: "absolute", inset: 0 }}>
                  <img src={originalUrl} alt="Original" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                </div>

                {/* Result image (left side, clipped) */}
                <div style={{
                  position: "absolute", inset: 0,
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                }}>
                  <div className="checkerboard" style={{ position: "absolute", inset: 0 }} />
                  <img src={resultUrl} alt="Result" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                </div>

                {/* Slider line */}
                <div className="comparison-slider-line" style={{ left: `${sliderPos}%` }}>
                  <div className="comparison-handle" style={{ top: "50%" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 4L3 10L7 16M13 4L17 10L13 16" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Labels */}
                <div style={{
                  position: "absolute", bottom: "12px", left: "12px",
                  background: "rgba(108,99,255,0.8)", color: "white",
                  padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                  pointerEvents: "none",
                }}>RESULT</div>
                <div style={{
                  position: "absolute", bottom: "12px", right: "12px",
                  background: "rgba(0,0,0,0.6)", color: "white",
                  padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                  pointerEvents: "none",
                }}>ORIGINAL</div>

                <p style={{
                  position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)",
                  color: "rgba(255,255,255,0.6)", fontSize: "12px",
                  background: "rgba(0,0,0,0.4)", padding: "4px 10px", borderRadius: "20px",
                  pointerEvents: "none",
                }}>← Drag to compare →</p>
              </div>
            )}

            {view === "original" && (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <img src={originalUrl} alt="Original" style={{ maxWidth: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "8px" }} />
              </div>
            )}

            {view === "result" && (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <div className="checkerboard" style={{ borderRadius: "12px", display: "inline-block" }}>
                  <img src={resultUrl} alt="Result with transparent background" style={{ maxWidth: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "8px", display: "block" }} />
                </div>
              </div>
            )}
          </div>

          {/* Image info */}
          {originalSize && (
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[
                { label: "File", value: fileName },
                { label: "Size", value: `${originalSize.w} × ${originalSize.h}px` },
                { label: "Format", value: "PNG (transparent)" },
                { label: "Status", value: "✓ Ready" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  flex: "1 1 140px",
                  background: "rgba(26,26,40,0.6)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                }}>
                  <div style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{label}</div>
                  <div style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={handleDownload}
              style={{ flex: "1 1 200px" }}
            >
              <span>⬇ Download PNG</span>
            </button>
            <button
              onClick={handleReset}
              style={{
                flex: "1 1 160px",
                padding: "14px 24px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >
              ↺ New Image
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {state === "error" && (
        <div className="glass-card fade-in-up" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ff6b6b", marginBottom: "8px" }}>Processing Failed</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "14px" }}>
            {logs.find(l => l.type === "error")?.message || "Something went wrong. Please try again."}
          </p>
          <button className="btn-primary" onClick={handleReset}>
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
