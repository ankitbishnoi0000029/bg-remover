import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BgEraser — AI Background Removal Tool | Free & Instant",
  description: "Remove image backgrounds instantly with AI. 100% free, no signup required. Works directly in your browser with no data uploaded to any server. Powered by advanced AI models.",
  keywords: "background removal, remove background, AI background eraser, free background remover, transparent background, image editor",
  authors: [{ name: "BgEraser" }],
  creator: "BgEraser",
  metadataBase: new URL("https://bgeraser.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bgeraser.app",
    title: "BgEraser — AI Background Removal Tool",
    description: "Remove image backgrounds instantly with AI. 100% free, no signup required.",
    siteName: "BgEraser",
  },
  twitter: {
    card: "summary_large_image",
    title: "BgEraser — AI Background Removal Tool",
    description: "Remove image backgrounds instantly with AI. 100% free, no signup required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body >{children}</body>
    </html>
  );
}
