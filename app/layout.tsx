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

export const metadata: Metadata = {
  title: "VANTH — NFT Collection on Solana",
  description: "Vanth is a web3 focused project inspired by the best with an innovative and dynamic style. Anime + cyberpunk NFT collection on Solana.",
  openGraph: {
    title: "VANTH — NFT Collection on Solana",
    description: "Vanth is a web3 focused project inspired by the best with an innovative and dynamic style.",
    type: "website",
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
        <div className="pl-14 flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
