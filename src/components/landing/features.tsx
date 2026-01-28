import { Compass, BookOpen, BarChart3, Repeat, Bell, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Smart Roadmaps",
    description: "AI-generated learning paths adapted to your goals.",
    icon: Compass,
    skeleton: (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-50/50">
        {/* Nodes connecting */}
        <div className="relative flex flex-col items-center gap-3 z-10">
          {/* Vertical Line from Top Node */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-black origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-75 -z-10" />

          {/* Horizontal Connector */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-4 border-t-2 border-x-2 border-black rounded-t-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 -z-10" />

          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 duration-500">
            <Compass className="w-6 h-6 text-blue-500" />
          </div>

          {/* Spacer to separate top node from children */}
          <div className="h-4 w-full" />

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10 transition-transform group-hover:translate-y-1 duration-500 delay-75 group-hover:border-black/10">
              <div className="w-4 h-4 rounded-full bg-slate-100 group-hover:bg-black transition-colors duration-300" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10 transition-transform group-hover:translate-y-1 duration-500 delay-150 group-hover:border-black/10">
              <div className="w-4 h-4 rounded-full bg-slate-100 group-hover:bg-black transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Background Grid Lines (Abstract) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
    )
  },
  {
    title: "Curated Resources",
    description: "Hand-picked videos and docs for every topic.",
    icon: BookOpen,
    skeleton: (
      <div className="relative w-full h-full p-6 flex flex-col gap-3 bg-slate-50/50 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm transition-all duration-500",
              "group-hover:translate-x-1",
              i === 1 ? "group-hover:delay-75" : i === 2 ? "group-hover:delay-150" : ""
            )}
          >
            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", i === 1 ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500")}>
              {i === 1 ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
              <div className="h-1.5 w-1/2 bg-slate-50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Progress Tracking",
    description: "Visualize your journey with detailed analytics.",
    icon: BarChart3,
    skeleton: (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-50/50">
        <div className="relative w-24 h-24">
          {/* Circle Background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="251.2"
              strokeLinecap="round"
              className="text-[#0f172a] group-hover:text-green-500 transition-all duration-1000 ease-out group-hover:stroke-[rgba(34,197,94,1)]"
              style={{ strokeDashoffset: "251.2px" }}
            />
            {/* The style rewrite above ensures the base offset is set, and a class modifies it on hover. 
                However, Tailwind arbitrary values for stroke-dashoffset might be tricky if not configured. 
                Let's use a style override for the hover state via a parent class or just use the style prop dynamically if possible (can't in pure CSS skeleton easily without JS state, but group-hover + arbitrary value works usually).
                
                Actually, let's try a safer way: Two circles, one invisible that becomes visible?
                Or just rely on Tailwind arbitrary values working: `group-hover:[stroke-dashoffset:60px]`
            */}
            <style dangerouslySetInnerHTML={{
              __html: `
                .group:hover .progress-circle {
                    stroke-dashoffset: 60px !important;
                    stroke: #22c55e !important;
                }
            `}} />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#0f172a"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="251.2"
              strokeLinecap="round"
              className="progress-circle transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-[#0f172a] group-hover:text-green-600 group-hover:scale-110 transition-all duration-300">75%</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Template Reuse",
    description: "Instantly clone and adapt existing roadmaps.",
    icon: Repeat,
    skeleton: (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-50/50">
        <div className="relative w-32 h-20">
          <div className="absolute top-0 left-0 w-full h-full bg-white rounded-xl border border-slate-200 shadow-sm z-10 transition-all duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:rotate-[-3deg]" />
          <div className="absolute top-2 left-2 w-full h-full bg-slate-100 rounded-xl border border-slate-200 z-0 transition-all duration-300 group-hover:translate-y-2 group-hover:translate-x-2 group-hover:rotate-[3deg]" />

          {/* Content inside top card */}
          <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col p-4 gap-2 transition-all duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:rotate-[-3deg]">
            <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
            <div className="h-1.5 w-full bg-slate-50 rounded-full" />
            <div className="h-1.5 w-2/3 bg-slate-50 rounded-full" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Smart Notifications",
    description: "Never miss a milestone with intelligent alerts.",
    icon: Bell,
    skeleton: (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-50/50">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:shake transition-all">
            <Bell className="w-8 h-8 text-[#0f172a] group-hover:rotate-[15deg] transition-transform duration-300" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white transform translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-300" />
          </div>

          {/* Toast Notification Pop-up */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 px-3 py-2 bg-[#0f172a] rounded-lg shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <div className="w-full h-1.5 bg-slate-400/30 rounded-full" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Interactive UI",
    description: "Drag, drop, and customize your learning path.",
    icon: Layout,
    skeleton: (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-50/50 overflow-hidden">
        <div className="relative w-full max-w-[180px] flex gap-3">
          {/* Columns */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-20 w-full bg-white border border-slate-200 rounded-lg shadow-sm" />
            <div className="h-20 w-full bg-white border border-slate-200 rounded-lg shadow-sm" />
          </div>
          <div className="flex-1 flex flex-col gap-2 mt-4">
            <div
              className="h-20 w-full bg-[#0f172a] rounded-lg shadow-lg transform transition-all duration-500 group-hover:-translate-y-8 group-hover:rotate-3"
            >
              <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full" />
            </div>
            <div className="h-20 w-full bg-white border border-slate-200 rounded-lg shadow-sm" />
          </div>

          {/* Cursor */}
          <svg
            className="absolute bottom-4 right-4 w-6 h-6 text-slate-900 fill-slate-900 transform translate-y-10 group-hover:translate-y-0 group-hover:-translate-x-8 transition-transform duration-700 ease-out"
            viewBox="0 0 24 24"
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      </div>
    )
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Visual Skeleton Area - Top 55% */}
              <div className="h-48 w-full border-b border-slate-50 overflow-hidden">
                {feature.skeleton}
              </div>

              {/* Text Content Area - Bottom 45% */}
              <div className="p-6 relative z-10 bg-white">
                <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#0f172a] group-hover:text-white transition-all duration-300">
                  <feature.icon className="h-5 w-5 transition-colors" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
