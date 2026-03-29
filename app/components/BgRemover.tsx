"use client";

import { useState, useCallback, useRef } from "react";

type ProcessingState = "idle" | "loading" | "processing" | "done" | "error";

export default function BgRemover() {
  const [state, setState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState(0);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [view, setView] = useState<"compare" | "result" | "original">("compare");

  // NEW FEATURES
  const [hdEnabled, setHdEnabled] = useState(false);
  const [blurToHd, setBlurToHd] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  const processFile = useCallback(async (file: File) => {
    if (processingRef.current) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload image");
      return;
    }

    processingRef.current = true;
    setState("loading");
    setFileName(file.name);

    const originalObjectUrl = URL.createObjectURL(file);
    setOriginalUrl(originalObjectUrl);

    try {
      setState("processing");

      const { removeBackground } = await import("@imgly/background-removal");

      const blob = await removeBackground(file, {
        publicPath: `${window.location.origin}/imgly-assets/`,
        progress: (_, current, total) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        },
      });

      let processedBlob = blob;

      // ✅ Blur + HD enhancement (canvas based)
      if (hdEnabled || blurToHd) {
        processedBlob = await enhanceImage(blob, blurToHd);
      }

      const resultObjectUrl = URL.createObjectURL(processedBlob);
      setResultUrl(resultObjectUrl);
      setState("done");
    } catch (err) {
      console.error(err);
      setState("error");
    } finally {
      processingRef.current = false;
    }
  }, [hdEnabled, blurToHd]);

  // 🧠 Image Enhancement Function
  const enhanceImage = (blob: Blob, applyBlur: boolean): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // upscale for HD
        const scale = 1.5;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        if (applyBlur) {
          ctx.filter = "blur(1px) contrast(110%)";
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((b) => resolve(b!), "image/png");
      };
    });
  };

  // 🎨 Apply Background Color
  const renderWithBackground = (src: string) => {
    return (
      <div
        className="flex justify-center items-center rounded-xl p-2"
        style={{ background: bgColor }}
      >
        <img src={src} className="max-h-[300px] object-contain" />
      </div>
    );
  };

  const handleDownload = async () => {
    if (!resultUrl) return;

    const img = new Image();
    img.src = resultUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `hd_${fileName}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const handleReset = () => {
    setState("idle");
    setOriginalUrl(null);
    setResultUrl(null);
    setProgress(0);
  };

  const isProcessing = state === "loading" || state === "processing";

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-0">

      {/* Upload */}
      {state === "idle" && (
        <div
          className="border-2 border-dashed border-gray-600 rounded-2xl text-center py-8 cursor-pointer hover:border-purple-500 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-lg font-semibold">Upload Image</p>
          <p className="text-sm text-gray-400">PNG, JPG, WebP</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
            }}
          />
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-900 rounded-xl p-6 text-center mt-4">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p>{progress}% Processing...</p>
        </div>
      )}

      {/* Result */}
      {state === "done" && resultUrl && originalUrl && (
        <div className="mt-4">

          {/* Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">

            <label className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg text-sm">
              <input
                type="checkbox"
                checked={hdEnabled}
                onChange={(e) => setHdEnabled(e.target.checked)}
              />
              HD Enhance
            </label>

            <label className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg text-sm">
              <input
                type="checkbox"
                checked={blurToHd}
                onChange={(e) => setBlurToHd(e.target.checked)}
              />
              Blur → HD
            </label>

            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg text-sm">
              🎨
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center gap-2 mb-3 flex-wrap">
            {["compare", "original", "result"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-3 py-1 rounded-full text-sm ${
                  view === v
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Images */}
          <div className="bg-gray-900 rounded-xl p-3">
            {view === "original" && renderWithBackground(originalUrl)}
            {view === "result" && renderWithBackground(resultUrl)}

            {view === "compare" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderWithBackground(originalUrl)}
                {renderWithBackground(resultUrl)}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-purple-600 py-2 rounded-lg"
            >
              Download HD
            </button>

            <button
              onClick={handleReset}
              className="flex-1 border border-gray-600 py-2 rounded-lg"
            >
              New Image
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="text-center p-6 bg-red-900/20 rounded-xl mt-4">
          <p className="text-red-400">Something went wrong</p>
          <button
            onClick={handleReset}
            className="mt-3 bg-purple-600 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}