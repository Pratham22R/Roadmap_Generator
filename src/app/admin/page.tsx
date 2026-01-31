import { getPrisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, LayoutTemplate, Briefcase, Mail, Activity } from "lucide-react"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
    const prisma = getPrisma()

    // Date calculations for last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    // Fetch stats safely with error handling
    let userCount = 0
    let roadmapCount = 0
    let templateCount = 0
    let subscriptionCount = 0
    let emailLogCount = 0
    let recentUsers: any[] = []
    let signupData: any[] = []
    let roadmapData: any[] = []
    let error = null

    try {
        // Parallel data fetching
        const [
            totalUsers,
            totalRoadmaps,
            totalTemplates,
            totalSubs,
            totalEmails,
            users,
            recentSignups,
            recentRoadmaps
        ] = await Promise.all([
            prisma.user.count(),
            prisma.roadmap.count(),
            prisma.roadmapTemplate.count(),
            prisma.subscription.count().catch(() => 0),
            prisma.emailLog.count(),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, createdAt: true, role: true }
            }),
            // Fetch raw data for charts (last 7 days)
            prisma.user.findMany({
                where: { createdAt: { gte: sevenDaysAgo } },
                select: { createdAt: true }
            }),
            prisma.roadmap.findMany({
                where: { createdAt: { gte: sevenDaysAgo } },
                select: { createdAt: true }
            })
        ])

        userCount = totalUsers
        roadmapCount = totalRoadmaps
        templateCount = totalTemplates
        subscriptionCount = totalSubs
        emailLogCount = totalEmails
        recentUsers = users

        // Process Chart Data
        const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

        // Initialize last 7 days map
        const dateMap = new Map<string, { date: string, signups: number, roadmaps: number }>()
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = formatDate(d)
            dateMap.set(dateStr, { date: dateStr, signups: 0, roadmaps: 0 })
        }

        // Fill Data
        recentSignups.forEach(u => {
            const dateStr = formatDate(new Date(u.createdAt))
            if (dateMap.has(dateStr)) dateMap.get(dateStr)!.signups++
        })
        recentRoadmaps.forEach(r => {
            const dateStr = formatDate(new Date(r.createdAt))
            if (dateMap.has(dateStr)) dateMap.get(dateStr)!.roadmaps++
        })

        const chartData = Array.from(dateMap.values())
        signupData = chartData.map(d => ({ date: d.date, count: d.signups }))
        roadmapData = chartData.map(d => ({ date: d.date, count: d.roadmaps }))

    } catch (e: any) {
        console.error("Database Error:", e)
        error = e.message || "Failed to load dashboard data"
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <h2 className="text-xl font-bold">System Error</h2>
                <p>{error}</p>
            </div>
        )
    }

    const stats = [
        {
            title: "Total Users",
            value: userCount,
            icon: Users,
            description: "Registered users",
        },
        {
            title: "Roadmaps Generated",
            value: roadmapCount,
            icon: FileText,
            description: "Total roadmaps created",
        },
        {
            title: "Cached Templates",
            value: templateCount,
            icon: LayoutTemplate,
            description: "Reusable roadmap templates",
        },
        {
            title: "Active Subscriptions",
            value: subscriptionCount,
            icon: Briefcase,
            description: "Premium subscribers",
        },
        {
            title: "Email Logs",
            value: emailLogCount,
            icon: Mail,
            description: "Total emails processed",
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="my-6">
                <AnalyticsCharts signupData={signupData} roadmapData={roadmapData} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No users found.</p>
                            ) : (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name || "Unknown Name"}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] uppercase text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Placeholder for another widget or chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium">All systems operational</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Database, Auth, and Email services are connected.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
