import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { TechnologyGrid } from "./technology-grid"
import { SocialProof } from "./social-proof"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-[140px] md:pt-[160px] pb-8">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start space-y-8">

            {/* Hero Badge */}
            <div className="inline-flex items-center rounded-full bg-[#f1f5f9] px-3 py-1.5 text-xs font-semibold text-[#0f172a] tracking-wide">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-purple-600 fill-purple-600" />
              AI-powered roadmap generation for developers
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold tracking-tight text-[#0f172a] sm:text-6xl lg:text-[64px] leading-[1.1]">
              Create structured learning roadmaps powered by AI
            </h1>

            {/* Subheading */}
            <p className="max-w-[520px] text-lg text-[#475569] sm:text-xl leading-relaxed">
              Generate step-by-step learning paths with videos, documentation, milestones, and progress tracking — all personalized to your goals.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Link href="/login">
                <Button className="h-[52px] px-8 text-[17px] font-medium bg-[#0f172a] text-white hover:bg-black/90 hover:scale-[1.02] transition-all rounded-[12px] w-full sm:w-auto shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]">
                  Get started free
                </Button>
              </Link>
              <Link href="#preview">
                <Button variant="outline" className="h-[52px] px-8 text-[17px] font-medium border-gray-200 text-[#0f172a] hover:bg-gray-50 hover:text-black rounded-[12px] w-full sm:w-auto">
                  View sample roadmap
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Technology Grid */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none flex justify-center lg:justify-end">
            <TechnologyGrid />
          </div>

        </div>

        {/* Social Proof */}
        <SocialProof />
      </div>
    </section>
  )
}
