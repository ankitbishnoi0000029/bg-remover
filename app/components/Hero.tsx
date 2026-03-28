"use client";

import classNames from "classnames";
import dynamic from "next/dynamic";
const BgRemover = dynamic(() => import("./BgRemover"), { ssr: false });

const stats = [
  { value: "100%", label: "Free Forever" },
  { value: "0", label: "Uploads" },
  { value: "∞", label: "Images" },
];

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 pt-28 pb-20">
      {/* Decorative rings */}
      <div className="absolute top-[15%] left-[5%] w-[300px] h-[300px] rounded-full border border-[rgba(108,99,255,0.08)] pointer-events-none hidden md:block" />
      <div className="absolute top-[20%] left-[5%] w-[200px] h-[200px] rounded-full border border-[rgba(108,99,255,0.05)] pointer-events-none hidden md:block" />
      <div className="absolute bottom-[20%] right-[5%] w-[250px] h-[250px] rounded-full border border-[rgba(0,212,170,0.07)] pointer-events-none hidden md:block" />

      {/* Headline block */}
      <div className="w-full max-w-[860px] text-center mb-14">
        <div className="badge fade-in-up inline-flex mb-6">
          <span className="text-[var(--teal)]">●</span>
          <span>Free · Private · No Signup Required</span>
        </div>

        <h1 className="fade-in-up fade-in-up-delay-1 font-[Space_Grotesk] text-[clamp(36px,7vw,72px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6">
          Remove backgrounds
          <br />
          <span className="shimmer-text">with one click</span>
        </h1>

        <p className="fade-in-up fade-in-up-delay-2 text-[clamp(16px,2.5vw,20px)] text-[var(--text-secondary)] max-w-[600px] mx-auto mb-10 leading-[1.7]">
          AI-powered background removal that runs entirely in your browser. No
          uploads. No accounts. No waiting. Just instant, pixel-perfect results.
        </p>

        {/* Stats */}
        <div className="fade-in-up fade-in-up-delay-3 flex flex-wrap justify-center gap-10 sm:gap-12 mb-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-[Space_Grotesk] text-[32px] font-bold text-[var(--accent-light)] leading-none mb-1">
                {value}
              </div>
              <div className="text-[13px] text-[var(--text-secondary)]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool card */}
      <div
        id="upload"
        className={classNames(
          "w-full max-w-[800px]",
          "glass-card",
          "fade-in-up",
          "fade-in-up-delay-4",
        )}
      >
        {/* Card header */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-5 border-b border-[var(--border)] p-4">
          <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-br from-[#6c63ff] to-[#00d4aa]">
            ✂
          </div>
<div className="ml-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border border-[rgba(0,212,170,0.3)] bg-[rgba(0,212,170,0.1)] text-[var(--teal)]">
              <span className="w-[6px] h-[6px] bg-[var(--teal)] rounded-full animate-pulse" />
              Ready
            </div>
          </div>
          <div >
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-0.5">
              AI Background Remover
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Powered by @imgly/background-removal · Runs locally in your
              browser
            </p>
          </div>

          
        </div>

        <BgRemover />
      </div>
    </section>
  );
}
