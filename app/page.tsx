import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "BgEraser — Free AI Background Removal | Instant, Private, No Upload",
  description:
    "Remove image backgrounds instantly with AI. Runs 100% in your browser — your images never leave your device. Free, no signup, no limits.",
  keywords:
    "background removal, remove background, AI background eraser, free background remover, transparent background, image editor",
  authors: [{ name: "BgEraser" }],
  metadataBase: new URL("https://bgeraser.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bgeraser.app",
    title: "BgEraser — AI Background Removal Tool",
    description:
      "Remove image backgrounds instantly with AI. 100% free, no signup required.",
    siteName: "BgEraser",
  },
  twitter: {
    card: "summary_large_image",
    title: "BgEraser — AI Background Removal Tool",
    description:
      "Remove image backgrounds instantly with AI. 100% free, no signup required.",
  },
  robots: { index: true, follow: true },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
