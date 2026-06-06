import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ScamWarningBanner } from "@/components/ui/ScamWarningBanner";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Gallery — VANTH NFT Collection",
  description: "Explore the full VANTH NFT art gallery. Anime + cyberpunk digital art on Solana.",
};

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">Gallery</h1>
        <p className="text-white/40 max-w-lg mx-auto">
          The VANTH universe in full view. Anime meets cyberpunk on the Solana blockchain.
        </p>
      </div>

      <GalleryGrid />

      <div className="mt-16 space-y-6">
        <ScamWarningBanner compact />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/whitelist" variant="primary" size="md">
            Request Access
          </Button>
          <Button href="/story" variant="secondary" size="md">
            Read the Story
          </Button>
        </div>
      </div>
    </div>
  );
}
