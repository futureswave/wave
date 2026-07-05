import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { IntroScreen } from "@/components/ui/IntroScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vanth.example.com";
const DESCRIPTION =
  "Vanth is a web3 focused project inspired by the best with an innovative and dynamic style. Anime + cyberpunk NFT collection.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VANTH",
    template: "%s — VANTH",
  },
  description: DESCRIPTION,
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "VANTH",
    description: DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "VANTH",
    images: [
      {
        url: "/images/gallery/banner.png",
        width: 1200,
        height: 630,
        alt: "VANTH — anime + cyberpunk NFT collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VANTH",
    description: DESCRIPTION,
    site: "@vanthverse",
    images: ["/images/gallery/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} antialiased`}>
        <IntroScreen />
        <Sidebar />
        <div className="relative z-10 pl-14 flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
