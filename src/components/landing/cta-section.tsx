import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="relative rounded-[32px] bg-[#f8fafc] border border-slate-100 p-12 md:p-24 text-center overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-white to-transparent rounded-full opacity-80 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a]">
                            Start building your roadmap today.
                        </h2>
                        <p className="text-lg text-[#475569] max-w-lg">
                            Join thousands of developers learning faster and smarter with AI-generated paths.
                        </p>
                        <Link href="/register">
                            <Button className="h-[56px] px-8 text-lg font-medium bg-[#0f172a] text-white hover:bg-black/90 hover:scale-[1.02] transition-all rounded-[14px] shadow-lg shadow-black/10">
                                Get Started for Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <p className="text-sm text-[#64748b]">No credit card required. Cancel anytime.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
