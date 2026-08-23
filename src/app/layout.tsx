import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSerif = localFont({
  src: [
    { path: "../../public/fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/InstrumentSerif-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-heading",
  display: "swap",
});

const manrope = localFont({
  src: [{ path: "../../public/fonts/Manrope-Variable.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anti-Ragging Support Portal",
  description: "A confidential way to raise concerns regarding ragging, harassment or intimidation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4169f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${manrope.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
