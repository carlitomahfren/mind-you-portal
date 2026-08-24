import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, SUSE } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import { ToastProvider } from "@/components/ui/toast";
import { NetworkStatus } from "@/components/ui/network-status";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const suse = SUSE({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-suse",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mind You Portal",
  description:
    "Your safe space providing holistic and expert well-being programs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002e39",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${suse.variable}`}>
      <body className="antialiased">
        <ToastProvider>
          <NetworkStatus />
          <PageTransition>{children}</PageTransition>
        </ToastProvider>
      </body>
    </html>
  );
}
