import { getPrisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function LogsPage() {
    const prisma = getPrisma()
    const logs = await prisma.emailLog.findMany({
        take: 50,
        orderBy: { triggeredAt: 'desc' },
        include: { user: { select: { email: true } } }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Email Delivery Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs">{new Date(log.triggeredAt).toLocaleString()}</TableCell>
                                    <TableCell>{log.emailType}</TableCell>
                                    <TableCell>{log.user.email}</TableCell>
                                    <TableCell>
                                        <span className={`text-xs px-2 py-1 rounded ${log.status === 'SENT' ? 'bg-green-100 text-green-700' :
                                                log.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
