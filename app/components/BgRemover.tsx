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

  // ================= PROCESS =================
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

  // ================= CANVAS =================
  const processCanvas = (blob: Blob, type: "blur" | "hd"): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        let scale = 1;
        if (type === "hd") scale = 1.6;

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // ✅ Strong blur
        if (type === "blur") {
          ctx.filter = "blur(10px)";
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // reset filter
        ctx.filter = "none";

        canvas.toBlob((b) => resolve(b!), "image/png");
      };
    });
  };

  // ================= DOWNLOAD =================
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

      {/* UPLOAD */}
      {state === "idle" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
          className="border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-2xl p-10 text-center cursor-pointer bg-gray-900"
        >
          <p className="text-lg">Upload Image</p>
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

      {/* PROCESSING */}
      {isProcessing && (
        <div className="text-center">
          <p>{progress}% Processing...</p>
        </div>
      )}

      {/* RESULT */}
      {state === "done" && blurUrl && hdUrl && (
        <div className="space-y-5">

          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />

          <div className="grid md:grid-cols-2 gap-4">

            {/* BLUR */}
            <div className="bg-gray-900 p-4 rounded-xl">
              <p className="text-yellow-400">Blur Image</p>
              <div style={{ background: bgColor }} className="p-2">
                <img src={blurUrl} className="max-h-[300px] mx-auto" />
              </div>
              <button
                onClick={() => downloadImage(blurUrl, `blur_${fileName}`)}
                className="mt-2 w-full bg-yellow-500 py-2"
              >
                Download Blur
              </button>
            </div>

            {/* HD */}
            <div className="bg-gray-900 p-4 rounded-xl">
              <p className="text-purple-400">HD Image</p>
              <div style={{ background: bgColor }} className="p-2">
                <img src={hdUrl} className="max-h-[300px] mx-auto" />
              </div>
              <button
                onClick={() => downloadImage(hdUrl, `hd_${fileName}`)}
                className="mt-2 w-full bg-purple-600 py-2"
              >
                Download HD
              </button>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full border py-2"
          >
            Upload New
          </button>
        </div>
      )}

      {/* ERROR */}
      {state === "error" && <p>Error occurred</p>}
    </div>
  );
}