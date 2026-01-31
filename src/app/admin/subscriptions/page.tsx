import { getPrisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function SubscriptionsPage() {
    const prisma = getPrisma()
    // Try to fetch subscriptions even if table might be empty
    const subscriptions = await prisma.subscription.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Active Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                    {subscriptions.length === 0 ? (
                        <p className="text-muted-foreground">No subscriptions found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Since</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell>{sub.user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
