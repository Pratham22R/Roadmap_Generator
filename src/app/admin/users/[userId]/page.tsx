
import { getPrisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserActions } from "@/components/admin/user-actions"
import { formatDistanceToNow } from "date-fns"

interface PageProps {
    params: Promise<{
        userId: string
    }>
}

export default async function UserDetailsPage({ params }: PageProps) {
    const prisma = getPrisma()
    const { userId } = await params

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            subscription: true,
            roadmaps: {
                orderBy: { createdAt: 'desc' }
            },
            emailLogs: {
                take: 10,
                orderBy: { triggeredAt: 'desc' }
            },
            _count: {
                select: {
                    sessions: true,
                    roadmaps: true
                }
            }
        }
    })

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="text-xl">{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{user.name || "Unknown Name"}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <UserActions userId={user.id} isBanned={user.isBanned} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono text-xs">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Role:</span>
                            <Badge variant="outline">{user.role}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className={user.isBanned ? "text-red-500 font-bold" : "text-green-600"}>
                                {user.isBanned ? "Banned" : "Active"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Joined:</span>
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.subscription ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant={user.subscription.status === 'active' ? 'default' : 'secondary'}>
                                        {user.subscription.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Plan ID:</span>
                                    <span className="font-mono text-xs truncate max-w-[150px]">
                                        {user.subscription.polarSubscriptionId || "N/A"}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-20 items-center justify-center text-muted-foreground">
                                No active subscription
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Activity Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Roadmaps:</span>
                            <span className="font-bold">{user._count.roadmaps}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Login Sessions:</span>
                            <span>{user._count.sessions}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Roadmaps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.roadmaps.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No roadmaps created yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {user.roadmaps.map(roadmap => (
                                    <div key={roadmap.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-sm">{roadmap.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(roadmap.createdAt))} ago
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {roadmap.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.emailLogs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No emails sent yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {user.emailLogs.map(log => (
                                    <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-sm">{log.emailType}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(log.triggeredAt))} ago
                                            </p>
                                        </div>
                                        <Badge variant={log.status === 'SENT' ? 'outline' : 'destructive'} className="text-xs">
                                            {log.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
