"use client";

import { useState, useCallback, useRef } from "react";

type ProcessingState = "idle" | "loading" | "processing" | "done" | "error";

export default function BgRemover() {
  const [state, setState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState(0);

  const [blurUrl, setBlurUrl] = useState<string | null>(null);
  const [hdUrl, setHdUrl] = useState<string | null>(null);

  const [fileName, setFileName] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  // PROCESS
  const processFile = useCallback(async (file: File) => {
    if (processingRef.current) return;

    processingRef.current = true;
    setState("loading");
    setFileName(file.name);

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

      const blurBlob = await processCanvas(blob, "blur");
      const hdBlob = await processCanvas(blob, "hd");

      setBlurUrl(URL.createObjectURL(blurBlob));
      setHdUrl(URL.createObjectURL(hdBlob));

      setState("done");
    } catch (err) {
      console.error(err);
      setState("error");
    } finally {
      processingRef.current = false;
    }
  }, []);

  // CANVAS PROCESS
  const processCanvas = (blob: Blob, type: "blur" | "hd"): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        let scale = 1;

        if (type === "hd") scale = 1.6;
        if (type === "blur") ctx.filter = "blur(2px)";

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((b) => resolve(b!), "image/png");
      };
    });
  };

  // DOWNLOAD
  const downloadImage = (src: string, name: string) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = name;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const handleReset = () => {
    setState("idle");
    setBlurUrl(null);
    setHdUrl(null);
    setProgress(0);
  };

  const isProcessing = state === "loading" || state === "processing";

  return (
    <div className="max-w-5xl mx-auto px-3 py-6">

      {/* ================= UPLOAD UI ================= */}
      {state === "idle" && (
        <div className="w-full">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-purple-500", "bg-purple-500/10");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("border-purple-500", "bg-purple-500/10");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-purple-500", "bg-purple-500/10");
              const file = e.dataTransfer.files?.[0];
              if (file) processFile(file);
            }}
            className="relative group border-2 border-dashed border-gray-600 hover:border-purple-500 transition-all duration-300 rounded-2xl p-6 sm:p-12 text-center cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-purple-500/10 blur-xl" />

            {/* Icon */}
            <div className="text-5xl mb-4 animate-bounce">📤</div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
              Drag & Drop your image
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 mb-5 text-sm">
              or click to browse files
            </p>

            {/* Button */}
            <button className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-md text-sm">
              Choose Image
            </button>

            {/* Info */}
            <p className="text-xs text-gray-500 mt-4">
              PNG, JPG, WEBP • Max 20MB
            </p>

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

          <p className="text-center text-xs text-gray-500 mt-3">
            💡 Tip: Higher quality image gives better HD result
          </p>
        </div>
      )}

      {/* ================= PROCESSING ================= */}
      {isProcessing && (
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm">{progress}% Processing...</p>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {state === "done" && blurUrl && hdUrl && (
        <div className="space-y-5">

          {/* BG Picker */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Background:</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Blur */}
            <div className="bg-gray-900 p-4 rounded-xl shadow">
              <p className="text-yellow-400 text-sm mb-2">Blur Image</p>

              <div style={{ background: bgColor }} className="p-2 rounded">
                <img src={blurUrl} className="max-h-[300px] mx-auto" />
              </div>

              <button
                onClick={() => downloadImage(blurUrl, `blur_${fileName}`)}
                className="mt-3 w-full bg-yellow-500 py-2 rounded-lg"
              >
                Download Blur
              </button>
            </div>

            {/* HD */}
            <div className="bg-gray-900 p-4 rounded-xl shadow">
              <p className="text-purple-400 text-sm mb-2">HD Image</p>

              <div style={{ background: bgColor }} className="p-2 rounded">
                <img src={hdUrl} className="max-h-[300px] mx-auto" />
              </div>

              <button
                onClick={() => downloadImage(hdUrl, `hd_${fileName}`)}
                className="mt-3 w-full bg-purple-600 py-2 rounded-lg"
              >
                Download HD
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-900 p-4 rounded-xl text-center text-sm text-gray-400">
            🔍 Blur = smooth image | HD = sharper + upscaled
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full border border-gray-600 py-2 rounded-lg"
          >
            Upload New Image
          </button>
        </div>
      )}

      {/* ERROR */}
      {state === "error" && (
        <div className="text-center text-red-400">
          Error occurred
          <button onClick={handleReset}>Retry</button>
        </div>
      )}
    </div>
  );
}