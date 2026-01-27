import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] opacity-30"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px] opacity-30"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground">
            <Sparkles className="mr-2 h-4 w-4 fill-primary text-primary" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI-Powered Learning Paths
            </span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:max-w-4xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Master Any Skill with <br className="hidden md:block" />
            <span className="text-primary">Intelligent Roadmaps</span>
          </h1>
          
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Generate personalized learning journeys tailored to your goals. 
            Stop guessing what to learn next and start mastering skills faster with AI-curated resources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5">
                Generate Roadmap
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-muted-foreground grayscale opacity-70">
             {/* Tech stack icons or social proof could go here */}
             <div className="text-sm font-medium">Powered by Gemini AI</div>
          </div>
        </div>
      </div>
    </section>
  )
}
