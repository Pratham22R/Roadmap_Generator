import { getPrisma } from "@/lib/prisma"
import RoadmapView from "@/components/roadmap/roadmap-view-dynamic"
import { auth } from "@/auth"
import { calculateStreak } from "@/lib/metrics"
import { redirect } from "next/navigation"

interface DetailedRoadmapPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function DetailedRoadmapPage({ params }: DetailedRoadmapPageProps) {
    const session = await auth()
    if (!session?.user?.id) return redirect("/login")

    // Fetch user streak for the view
    const streak = await calculateStreak(session.user.id)


    const { id } = await params
    const prisma = getPrisma()

    const roadmap = await prisma.roadmap.findUnique({
        where: {
            id: id,
            userId: session.user.id // Security: Ensure user owns roadmap
        },
        include: {
            // Include Template Data
            template: {
                include: {
                    phases: {
                        include: {
                            skills: {
                                include: {
                                    resources: true
                                }
                            }
                        },
                        orderBy: { order: 'asc' }
                    }
                }
            },
            // Include Progress
            progress: true,
        }
    })

    if (!roadmap || !roadmap.template) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-red-400">Roadmap Not Found</h1>
                <p className="text-zinc-400">The roadmap you are looking for does not exist or is invalid.</p>
            </div>
        )
    }

    // TRANSFORM DATA FOR UI
    // Create a map of progress for O(1) lookup
    const progressMap = new Map(
        roadmap.progress.map(p => [p.skillId, p.status])
    )

    const displayPhases = roadmap.template.phases.map((phase: any) => ({
        id: phase.id,
        title: phase.title,
        duration: phase.duration,
        skills: phase.skills.map((skill: any) => ({
            id: skill.id,
            title: skill.title,
            description: skill.description,
            estimatedTime: skill.estimatedTime,
            // Merge status from progress
            status: progressMap.get(skill.id) || "PENDING",
            resources: skill.resources
        }))
    })) as any

    // Construct the UI object
    const uiRoadmap = {
        ...roadmap,
        phases: displayPhases
    }

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-6">
                <a href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
                    ← Back to Dashboard
                </a>
            </div>
            <RoadmapView roadmap={uiRoadmap} streak={streak} />
        </div>
    )
}
