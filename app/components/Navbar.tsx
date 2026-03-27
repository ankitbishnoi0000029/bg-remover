"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 sm:px-6 md:px-8 py-4
      ${
        scrolled
          ? "bg-[rgba(10,10,15,0.95)] backdrop-blur-xl border-b border-[rgba(108,99,255,0.15)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br from-[#6c63ff] to-[#00d4aa]">
            ✂
          </div>

          <span className="font-[Space_Grotesk] text-lg sm:text-xl font-bold text-[#f0f0ff]">
            Bg<span className="text-[#6c63ff]">Eraser</span>
          </span>
        </div>

      </div>
    </nav>
  );
}