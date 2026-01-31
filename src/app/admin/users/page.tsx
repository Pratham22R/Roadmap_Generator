import { getPrisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserActions } from "@/components/admin/user-actions"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
    const prisma = getPrisma()

    // Simple pagination could be added later, fetching first 50 for now
    const users = await prisma.user.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
            subscription: true,
            _count: {
                select: { roadmaps: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <Badge variant="outline" className="text-sm">
                    Total: {users.length} (showing recent 50)
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">User</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Roadmaps</th>
                                    <th className="px-4 py-3">Joined</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => (
                                    <tr key={user.id} className={`hover:bg-muted/50 transition-colors ${user.isBanned ? 'bg-red-50/50' : ''}`}>
                                        <td className="px-4 py-3 font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.image || ""} />
                                                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span>{user.name || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {user.isBanned && (
                                                    <Badge variant="destructive" className="text-[10px]">
                                                        BANNED
                                                    </Badge>
                                                )}
                                                {user.subscription ? (
                                                    <Badge variant="outline" className="border-green-500 text-green-600">
                                                        {user.subscription.status}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user._count.roadmaps}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <UserActions userId={user.id} isBanned={user.isBanned} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
