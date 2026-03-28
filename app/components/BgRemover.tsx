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
      addLog("Please upload a valid image file", "error");
      return;
    }

    processingRef.current = true;
    setLogs([]);
    setState("loading");
    setFileName(file.name);

    const originalObjectUrl = URL.createObjectURL(file);
    setOriginalUrl(originalObjectUrl);

    const img = new Image();
    img.onload = () => setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = originalObjectUrl;

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

      const resultObjectUrl = URL.createObjectURL(blob);
      setResultUrl(resultObjectUrl);
      setState("done");
    } catch (err) {
      setState("error");
    } finally {
      processingRef.current = false;
    }
  }, []);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `bgeraser_${fileName}.png`;
    a.click();
  };

  const handleReset = () => {
    setState("idle");
    setOriginalUrl(null);
    setResultUrl(null);
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const isProcessing = state === "loading" || state === "processing";

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto">

      {/* Upload */}
      {state === "idle" && (
        <div
          className={`border-2 border-dashed rounded-2xl text-center cursor-pointer transition py-4 ${
            dragOver ? "border-purple-500 bg-purple-500/10" : "border-gray-600"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="text-5xl mb-6">🖼️</div>
          <h2 className="text-xl font-bold mb-2">Drop your image here</h2>
          <p className="text-gray-400 mb-6">PNG, JPG, WebP up to 20MB</p>

          <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition">
            Choose Image
          </button>

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
        <div className="bg-gray-900 rounded-2xl p-10 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6" />
          <h3 className="text-lg font-bold mb-2">Processing Image...</h3>

          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-400">{progress}%</p>
        </div>
      )}

      {/* Result */}
      {state === "done" && originalUrl && resultUrl && (
        <div>
          {/* Toggle */}
          <div className="flex gap-2 justify-center mb-4">
            {["compare", "original", "result"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-4 py-2 rounded-full text-sm ${
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
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            {view === "original" && (
              <img src={originalUrl} className="mx-auto max-h-[400px]" />
            )}

            {view === "result" && (
              <img src={resultUrl} className="mx-auto max-h-[400px]" />
            )}

            {view === "compare" && (
              <div className="grid md:grid-cols-2 gap-4">
                <img src={originalUrl} />
                <img src={resultUrl} />
              </div>
            )}
          </div>

          {/* Info */}
          {originalSize && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-400">File</p>
                <p className="text-sm">{fileName}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Size</p>
                <p className="text-sm">{originalSize.w}x{originalSize.h}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-purple-600 py-3 rounded-xl"
            >
              Download
            </button>

            <button
              onClick={handleReset}
              className="flex-1 border border-gray-600 py-3 rounded-xl"
            >
              New Image
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="text-center p-10 bg-red-900/20 rounded-xl">
          <h3 className="text-red-400 font-bold mb-4">Error</h3>
          <button
            onClick={handleReset}
            className="bg-purple-600 px-6 py-3 rounded-xl"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}