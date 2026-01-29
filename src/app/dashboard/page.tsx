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
import { StatsOverview } from "@/components/dashboard/stats-overview"

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
      template: {
        include: {
          phases: {
            include: { skills: true }
          }
        }
      },
      progress: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Fetch Activity Logs for Last 7 Days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const activityLogs = await getPrisma().progressLog.findMany({
    where: {
      userId: session?.user?.id,
      timestamp: { gte: sevenDaysAgo }
    },
    orderBy: { timestamp: 'asc' }
  })

  // Aggregate Weekly Activity
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i)) // Going back 6 days + today
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })

    // Count logs for this day
    const count = activityLogs.filter(log => log.timestamp.toISOString().startsWith(dateStr)).length

    return { date: dayName, count }
  })


  // Subscription check
  const subscription = await getPrisma().subscription.findFirst({
    where: { userId: session?.user.id }
  })
  const isPremium = subscription?.status === "PREMIUM" || subscription?.status === "PRO"


  // Unified Stats Calculation
  const totalRoadmaps = roadmaps.length
  let totalSkillsAcrossAll = 0
  let completedSkillsAcrossAll = 0

  roadmaps.forEach(roadmap => {
    const stats = getRoadmapStats(roadmap)
    totalSkillsAcrossAll += stats.totalSkills
    completedSkillsAcrossAll += stats.completedSkills
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4 transition-all hover:shadow-md">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-1.5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full shadow-sm" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-slate-500 pl-4 text-sm font-medium">
            Manage your personal learning journeys
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {process.env.NODE_ENV === "development" && (
            <div className="bg-slate-50 p-1 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
              <SyncButton />
            </div>
          )}
          <div className="h-8 w-px bg-slate-100 hidden md:block" />
          <div className="hover:scale-105 transition-transform duration-200">
            <UserNav user={session?.user} />
          </div>
        </div>
      </div>

      {/* Pro Banner (Hidden if Premium) - Moved here */}
      {!isPremium && (
        <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50 p-6 flex justify-between items-center group hover:border-blue-200 transition-colors">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-blue-900">Unlock Premium Features</h3>
            <p className="text-blue-600/80 text-sm max-w-md">Get unlimited roadmaps, AI tutor access, and advanced analytics.</p>
          </div>
          <form action={createCheckout} className="relative z-10">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20">
              Upgrade to Pro
            </Button>
          </form>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-100 transition-colors" />
        </div>
      )}

      {/* New Stats Overview with Charts */}
      <StatsOverview
        totalRoadmaps={totalRoadmaps}
        completedSkills={completedSkillsAcrossAll}
        totalSkills={totalSkillsAcrossAll}
        weeklyActivity={weeklyActivity}
        streak={streak}
      />

      {/* Roadmaps Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Journeys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <CreateRoadmapCard isPro={isPremium} currentCount={totalRoadmaps} />

          {/* Existing Roadmaps */}
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------- HELPER FUNCTIONS -------------------- */
// ... existing getRoadmapStats code ...
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
      <Card className="h-full border border-slate-200 bg-white group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden rounded-2xl relative">
        <div className="h-1.5 w-full bg-slate-100 group-hover:bg-blue-500/30">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-white group-hover:to-blue-100" style={{ width: `${stats.progressPercentage}%` }} />
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border border-slate-100 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 transition-colors">
              {stats.totalPhases} Phases
            </div>
            {stats.progressPercentage === 100 && (
              <div className="text-green-500 bg-green-50 p-1 rounded-full shadow-sm group-hover:bg-white/20 group-hover:text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors line-clamp-1">
            {roadmap.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 mt-2 text-slate-500 text-xs leading-relaxed group-hover:text-blue-100">
            {roadmap.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow pt-0">
          {/* Spacer */}
        </CardContent>

        <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 bg-slate-50/50 mt-auto group-hover:bg-blue-700/50 group-hover:border-blue-500/30">
          <div className="w-full flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden group-hover:bg-blue-800">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500 group-hover:bg-white" style={{ width: `${stats.progressPercentage}%` }} />
              </div>
              <span className="text-slate-400 font-medium text-xs group-hover:text-blue-200">{stats.progressPercentage}%</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400 group-hover:translate-x-1 transition-transform group-hover:text-white font-semibold text-[10px] uppercase tracking-wide">
              Continue <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </a>
  )
}

