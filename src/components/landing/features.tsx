import { Compass, BookOpen, BarChart3, Repeat, Bell, Layout } from "lucide-react"

const features = [
  {
    title: "Smart Roadmaps",
    description: "AI-generated learning paths based on your experience level and goals.",
    icon: Compass,
  },
  {
    title: "Curated Resources",
    description: "Each topic includes hand-picked YouTube videos and official documentation.",
    icon: BookOpen,
  },
  {
    title: "Progress Tracking",
    description: "Track completed skills, milestones, and visualize your journey.",
    icon: BarChart3,
  },
  {
    title: "Template Reuse",
    description: "Identical roadmaps reuse cached templates for instant generation.",
    icon: Repeat,
  },
  {
    title: "Smart Notifications",
    description: "Get email reminders and weekly summaries to stay on track.",
    icon: Bell,
  },
  {
    title: "Interactive UI",
    description: "A clean, drag-and-drop interface to manage your learning tasks.",
    icon: Layout,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
            Everything you need to master new skills
          </h2>
          <p className="text-[#475569] text-lg">
            Stop wasting time searching for tutorials. Get a structured plan that guides you from zero to hero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300"
            >
              <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-[#0f172a]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{feature.title}</h3>
              <p className="text-[#475569] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
