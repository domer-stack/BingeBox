import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "BingeBox — Your life in TV",
  description: "Track TV shows, rate episodes, build lists, and discover what to watch next.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "BingeBox — Your life in TV",
    description: "Track TV shows, rate episodes, build lists, and discover what to watch next.",
    siteName: "BingeBox",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "BingeBox logo" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e4ebf5" },
    { media: "(prefers-color-scheme: dark)", color: "#08090d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <ThemeScript />
      </head>
      <body className="antialiased">
        <div className="ambient-bg" aria-hidden="true" />
        <Providers>
          <Header />
          <main className="relative z-0">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
