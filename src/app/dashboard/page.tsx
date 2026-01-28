import { getPrisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { calculateStreak } from "@/lib/metrics"
import { createCheckout } from "@/actions/subscription"
import { UserNav } from "@/components/dashboard/user-nav"
import { SyncButton } from "@/components/dashboard/sync-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react"
import { CreateRoadmapCard } from "@/components/dashboard/create-roadmap-card"

export default async function DashboardPage() {
  const session = await auth()
  const streak = await calculateStreak(session?.user?.id!)

  // Fetch ALL roadmaps (Unified Query)
  const roadmaps = await getPrisma().roadmap.findMany({
    where: {
      userId: session?.user?.id,
      status: "ACTIVE"
    },
    include: {
      // New structure
      template: {
        include: {
          phases: {
            include: { skills: true }
          }
        }
      },
      progress: true // SkillProgress entries
    },
    orderBy: { createdAt: 'desc' }
  })

  // Subscription check
  const subscription = await getPrisma().subscription.findFirst({
    where: { userId: session?.user.id }
  })


  // Strict check
  const isPremium = subscription?.status === "PREMIUM" || subscription?.status === "PRO"

  // Unified Stats Calculation
  const totalRoadmaps = roadmaps.length

  const completedSkills = roadmaps.reduce((acc, roadmap) => {
    const stats = getRoadmapStats(roadmap)
    return acc + stats.completedSkills
  }, 0)

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">
            Track your progress and manage your learning paths.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-4 hidden md:flex">
            <div className="text-right">
              <p className="text-zinc-500 text-xs uppercase tracking-wider">Total Roadmaps</p>
              <p className="text-2xl font-bold text-zinc-200">{totalRoadmaps}</p>
            </div>
            <div className="w-px h-10 bg-zinc-800"></div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs uppercase tracking-wider">Skills Mastered</p>
              <p className="text-2xl font-bold text-green-400">{completedSkills}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400">
            <span className="text-xl font-bold">🔥 {streak}</span>
            <span className="text-xs uppercase tracking-wider font-medium">Day Streak</span>
          </div>

          {process.env.NODE_ENV === "development" && (
            <SyncButton />
          )}

          <UserNav user={session?.user} />
        </div>
      </div>

      {/* Pro Banner (Hidden if Premium) */}
      {!isPremium && (
        <div className="relative overflow-hidden rounded-xl border border-blue-500/30 bg-blue-500/10 p-6 flex justify-between items-center group hover:border-blue-500/50 transition-colors">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-blue-100">Unlock Premium Features</h3>
            <p className="text-blue-300/80 text-sm max-w-md">Get unlimited roadmaps, AI tutor access, and advanced analytics.</p>
          </div>
          <form action={createCheckout} className="relative z-10">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
              Upgrade to Pro
            </Button>
          </form>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-500/30 transition-colors" />
        </div>
      )}

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Create New Card */}
        <CreateRoadmapCard isPro={isPremium} currentCount={totalRoadmaps} />

        {/* Existing Roadmaps */}
        {roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.id} roadmap={roadmap} />
        ))}
      </div>
    </div>
  )
}

/* -------------------- HELPER FUNCTIONS -------------------- */

// Helper to handle mixed data sources (Legacy vs Template)
function getRoadmapStats(roadmap: any) {
  let totalPhases = 0
  let totalSkills = 0
  let completedSkills = 0

  // 1. Check if using Loop (New Template System)
  if (roadmap.templateId && roadmap.template) {
    totalPhases = roadmap.template.phases.length || 0

    // Count total skills in template
    if (roadmap.template.phases) {
      // @ts-ignore
      roadmap.template.phases.forEach(phase => {
        totalSkills += phase.skills.length
        // Check progress log for these skills
        // @ts-ignore
        phase.skills.forEach(skill => {
          // @ts-ignore
          const isCompleted = roadmap.progress.some(p => p.skillId === skill.id && p.status === "COMPLETED")
          if (isCompleted) completedSkills++
        })
      })
    }
  }

  return {
    totalPhases,
    totalSkills,
    completedSkills,
    progressPercentage: totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0
  }
}

function RoadmapCard({ roadmap }: { roadmap: any }) {
  const stats = getRoadmapStats(roadmap)

  return (
    <a href={`/dashboard/roadmap/${roadmap.id}`} className="block h-full group">
      <Card className="h-full border-zinc-800 bg-zinc-900/60 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/80 transition-all flex flex-col overflow-hidden">
        <div className="h-2 w-full bg-zinc-800">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${stats.progressPercentage}%` }} />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400">
              <BookOpen className="h-5 w-5" />
            </div>
            {stats.progressPercentage === 100 && (
              <div className="text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1">{roadmap.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-2">{roadmap.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div>
              <p className="text-zinc-500 text-xs uppercase">Duration</p>
              <p className="text-zinc-300 font-medium">Flexible</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase">Phases</p>
              <p className="text-zinc-300 font-medium">{stats.totalPhases}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/5 pt-4">
          <div className="w-full flex justify-between items-center text-sm">
            <span className="text-zinc-500">{stats.progressPercentage}% Complete</span>
            <div className="flex items-center gap-1 text-zinc-400 group-hover:translate-x-1 transition-transform">
              View Details <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </a>
  )
}
