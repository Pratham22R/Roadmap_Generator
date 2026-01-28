"use client"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { RoadmapPreview } from "@/components/landing/roadmap-preview"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { CTASection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white selection:bg-black selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <RoadmapPreview />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  )
}
