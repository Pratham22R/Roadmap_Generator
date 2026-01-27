import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Layers, Zap, Clock, Share2, Award } from "lucide-react"

const features = [
  {
    title: "AI-Powered Generation",
    description: "Leverage advanced AI to create comprehensive, step-by-step learning paths for any skill or technology.",
    icon: Brain,
    color: "text-purple-500",
  },
  {
    title: "Curated Resources",
    description: "Get the best articles, videos, and courses automatically selected for each topic in your roadmap.",
    icon: Layers,
    color: "text-blue-500",
  },
  {
    title: "Personalized Pace",
    description: "Roadmaps adapt to your timeline and current skill level, ensuring efficiently learning.",
    icon: Clock,
    color: "text-green-500",
  },
  {
    title: "Instant Updates",
    description: "Technology moves fast. Regenerate roadmaps to keep up with the latest industry standards.",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    title: "Track Progress",
    description: "Mark topics as complete and visualize your journey from beginner to expert.",
    icon: Award,
    color: "text-orange-500",
  },
  {
    title: "Share & Export",
    description: "Share your roadmaps with friends or export them to keep your learning organized.",
    icon: Share2,
    color: "text-pink-500",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to master new skills</h2>
                <p className="text-muted-foreground text-lg">Stop wasting time searching for tutorials. Get a structured plan that guides you from zero to hero.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <Card key={index} className="border-muted bg-background/50 hover:bg-background/80 transition-colors hover:border-primary/50 shadow-sm hover:shadow-md">
                        <CardHeader>
                            <feature.icon className={`h-10 w-10 mb-2 ${feature.color}`} />
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  )
}
